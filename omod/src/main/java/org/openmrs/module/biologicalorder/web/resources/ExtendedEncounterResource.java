package org.openmrs.module.biologicalorder.web.resources;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import org.openmrs.Encounter;
import org.openmrs.EncounterType;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.webservices.rest.web.annotation.Resource;
import org.openmrs.module.webservices.rest.web.resource.api.PageableResult;
import org.openmrs.module.webservices.rest.web.resource.impl.NeedsPaging;
import org.openmrs.module.webservices.rest.web.v1_0.resource.openmrs2_2.EncounterResource2_2;

import com.mchange.v2.lang.StringUtils;
import java.text.ParseException;

import org.openmrs.module.biologicalorder.api.BiologicalOrderService;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.RestConstants;

@Resource(name = RestConstants.VERSION_1 + "/encounter", supportedClass = Encounter.class, supportedOpenmrsVersions = { "2.*" }, order = 4)
public class ExtendedEncounterResource extends EncounterResource2_2 {
	
	@Override
	protected PageableResult doSearch(RequestContext context) {
		String encounterTypeUuid = context.getParameter("encounterType");
		String startDate = context.getParameter("startDate");
		String endDate = context.getParameter("endDate");
		String patientUuid = context.getParameter("patient");
		Boolean sorted = Boolean.valueOf(context.getParameter("sorted"));
		
		if (StringUtils.nonEmptyString(encounterTypeUuid) && StringUtils.nonEmptyString(startDate)
		        && StringUtils.nonEmptyString(endDate)) {
			DateFormat sourceFormat = new SimpleDateFormat("yyyy-MM-dd");
			try {
				EncounterType encounterType = Context.getEncounterService().getEncounterTypeByUuid(encounterTypeUuid);
				
				Date date1 = sourceFormat.parse(startDate);
				Date date2 = sourceFormat.parse(endDate);
				if (encounterType != null) {
					List<Encounter> encounters = Context.getService(BiologicalOrderService.class)
					        .getLatestEncounterList(encounterType, date1, date2);
                    Set<Patient> patients = new HashSet<Patient>();
                    encounters.forEach(enc -> patients.add(enc.getPatient())); 
                    
                    List<Encounter> filteredEncounters = new ArrayList<>();
                    patients.forEach(patient -> {
                        Optional<Encounter> enc = encounters.stream().filter(e -> e.getPatient().getUuid().equals(patient.getUuid())).findFirst();
                        if(enc.isPresent()){
                            filteredEncounters.add(enc.get());
                        }
                    });
					
					return new NeedsPaging<Encounter>(filteredEncounters, context);
				}
			}
			catch (ParseException e) {
				throw new RuntimeException(e);
			}
			
		}else if(StringUtils.nonEmptyString(encounterTypeUuid) && StringUtils.nonEmptyString(patientUuid)
		&& sorted ){
			EncounterType encounterType = Context.getEncounterService().getEncounterTypeByUuid(encounterTypeUuid);
			Patient patient = Context.getPatientService().getPatientByUuid(patientUuid);
			if(encounterType != null && patient != null){
				List<Encounter> encounters = Context.getService(BiologicalOrderService.class)
					        .getLatestPatientEncounterList(encounterType, patient);
				return new NeedsPaging<Encounter>(encounters, context);			
			}				

		}
		return super.doSearch(context);
	}
}

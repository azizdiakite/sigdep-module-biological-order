package org.openmrs.module.biologicalorder.web.resources;

import com.mchange.v2.lang.StringUtils;
import org.openmrs.*;
import org.openmrs.api.context.Context;
import org.openmrs.module.biologicalorder.api.BiologicalOrderService;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.annotation.Resource;
import org.openmrs.module.webservices.rest.web.resource.api.PageableResult;
import org.openmrs.module.webservices.rest.web.resource.impl.NeedsPaging;
import org.openmrs.module.webservices.rest.web.v1_0.resource.openmrs1_11.ObsResource1_11;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Resource(name = RestConstants.VERSION_1 + "/observation-in", supportedClass = Obs.class, supportedOpenmrsVersions = {
        "1.8.*", "1.9.*", "1.11.*", "1.12.*", "2.*" }, order = 4)
public class ExtendedObsResource extends ObsResource1_11 {
	
	@Override
	protected PageableResult doSearch(RequestContext context) {
		String encounterTypeUuid = context.getParameter("encounterType");
		String latestDateString = context.getParameter("date");
		String patientUuid = context.getParameter("patient");
		String conceptUuid = context.getParameter("concept");
		String locationUuid = context.getParameter("location");
		
		if (StringUtils.nonEmptyString(encounterTypeUuid) && StringUtils.nonEmptyString(patientUuid)
		        && StringUtils.nonEmptyString(latestDateString) && StringUtils.nonEmptyString(locationUuid)
		        && StringUtils.nonEmptyString(conceptUuid)) {
			DateFormat sourceFormat = new SimpleDateFormat("yyyy-MM-dd");
			try {
				EncounterType encounterType = Context.getEncounterService().getEncounterTypeByUuid(encounterTypeUuid);
				Concept concept = Context.getConceptService().getConceptByUuid(conceptUuid);
				Person person = Context.getPatientService().getPatientByUuid(patientUuid);
				Location location = Context.getLocationService().getLocationByUuid(locationUuid);
				
				Date startDate = sourceFormat.parse(latestDateString);
				
				if (encounterType != null && person != null && concept != null && location != null) {
					Obs obs = Context.getService(BiologicalOrderService.class).getLatestObsByConcept(person, concept,
					    startDate, location, encounterType);
					if (obs != null) {
						List<Obs> obsList = new ArrayList<Obs>();
						obsList.add(obs);
						return new NeedsPaging<Obs>(obsList, context);
					}
				}
			}
			catch (ParseException e) {
				throw new RuntimeException(e);
			}
			
		}
		
		return super.doSearch(context);
	}
}

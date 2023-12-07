package org.openmrs.module.biologicalorder;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.jms.MapMessage;
import javax.jms.Message;

import org.openmrs.event.EventListener;
import org.openmrs.module.DaemonToken;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.EncounterType;
import org.openmrs.Form;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.ObsService;
import org.openmrs.api.context.Context;

public class OrderResultEventListener implements EventListener {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	private static final Integer HIV_VIRAL_LOAD_ID = 856;
	
	private static final Integer FORM_ID = 5;
	
	private static final int ENCOUNTER_TYPE_ID = 8;
	
	private DaemonToken daemonToken;
	
	public OrderResultEventListener(DaemonToken token) {
		daemonToken = token;
	}
	
	@Override
	public void onMessage(Message message) {
		System.out.println("IN EVENT LISTENER ::: OrderResultEventListener");
		try {
			Context.openSession();
	

			MapMessage mapMessage = (MapMessage) message;

			String uuid = mapMessage.getString("uuid");
			String userUuid = mapMessage.getString("userUuid");
		
			Context.authenticate("admin","Dppeis@pnls_16");
		
            ObsService obsService = Context.getObsService();
			Obs obs = obsService.getObsByUuid(uuid);
         
			

			if (obs.getConcept().getConceptId().compareTo(HIV_VIRAL_LOAD_ID) == 0) {
                Form form = Context.getFormService().getForm(FORM_ID);
                Patient patient = Context.getPatientService().getPatient(obs.getPersonId());
                Concept concept_164596 = Context.getConceptService().getConceptByUuid("164596AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                Concept concept_1305 = Context.getConceptService().getConceptByUuid("1305AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                Concept concept_1301 = Context.getConceptService().getConceptByUuid("1301AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                Concept concept_1306 = Context.getConceptService().getConceptByUuid("1306AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                
				System.out.println("main obs-value ::::::"+ obs.getValueNumeric());

                Obs obs2 = new Obs(patient, concept_164596, null, null);
                obs2.setValueNumeric(obs.getValueNumeric() > 0 ? obs.getValueNumeric() : 0);
				obs2.setObsDatetime(new Date());
				obs2.setGroupMembers(null);

				Obs obs3 = new Obs(patient, concept_1305, null, null);
				obs3.setValueCoded(obs.getValueNumeric() > 0 ? concept_1301 : concept_1306);
				obs3.setObsDatetime(new Date());
				obs2.setGroupMembers(null);
                Set<Obs> obsList = new HashSet<>();
                obsList.add(obs2);
                obsList.add(obs3);
                EncounterType encounterType = new EncounterType(ENCOUNTER_TYPE_ID);
                Encounter encounter = new Encounter();
                encounter.setForm(form);
                encounter.setPatient(patient);
                encounter.setEncounterType(encounterType);
				encounter.setEncounterDatetime(new Date());
				encounter.setLocation(obs.getLocation());
                Encounter encounterSaved = Context.getEncounterService().saveEncounter(encounter);
				obs2.setEncounter(encounterSaved);
				obs3.setEncounter(encounterSaved);
				obsService.saveObs(obs2, userUuid);
				obsService.saveObs(obs3, userUuid);
                
            }

			Context.closeSession();
		}
		catch (Exception e) {
            System.out.println(e.getMessage());
			System.out.println(e);
			System.out.println("Ooops! some error occurred");
		}
		
	}

}

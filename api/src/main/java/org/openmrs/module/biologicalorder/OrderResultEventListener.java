package org.openmrs.module.biologicalorder;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.jms.MapMessage;
import javax.jms.Message;

import org.openmrs.event.EventListener;
import org.openmrs.event.Event.Action;
import org.openmrs.module.DaemonToken;
import org.springframework.stereotype.Component;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.EncounterType;
import org.openmrs.Form;
import org.openmrs.Location;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.ObsService;
import org.openmrs.api.context.Context;
import org.openmrs.api.context.Daemon;

@Component
public class OrderResultEventListener implements EventListener {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	private static final int HIV_VIRAL_LOAD_ID = 856;//; 164429
	
	private static final Integer FORM_ID = 5;
	
	private static final int ENCOUNTER_TYPE_ID = 8;
	
	private int time = 0;
	
	private DaemonToken daemonToken;
	
	public OrderResultEventListener(DaemonToken token) {
		daemonToken = token;
	}
	
	public OrderResultEventListener() {
	}
	
	public DaemonToken getDaemonToken() {
		return daemonToken;
	}
	
	public void setDaemonToken(DaemonToken daemonToken) {
		this.daemonToken = daemonToken;
	}
	
	@Override
	public void onMessage(Message message) {
		log.trace(String.format("Received message: \n%s", message));
		System.out.println("IN EVENT LISTENER ::: OrderResultEventListener");
		try {
			Daemon.runInDaemonThread(() -> {
				try {
					processMessage(message);
				}
				catch (Exception e) {
					log.error(String.format("Failed to process obs message!\n%s", message.toString()), e);
				}
			}, daemonToken);
		} catch (Exception e) {
			log.error(String.format("Failed to start Daemon thread to process message!\n%s", message.toString()), e);
		}

	}
	
	private void processMessage(Message message) throws Exception {

			MapMessage mapMessage = (MapMessage) message;

			String uuid = mapMessage.getString("uuid");
			String userUuid = mapMessage.getString("userUuid");
				    
            ObsService obsService = Context.getObsService();
			Obs obs = Context.getObsService().getObsByUuid(uuid);

			Location defaultLocation = Context.getLocationService().getDefaultLocation();

			 System.out.println("CONCEPT-ID :::: " + obs.getConcept().getId());
			 System.out.println("CONDITION :::: " + obs.getConcept().getId().compareTo(HIV_VIRAL_LOAD_ID) );
			 System.out.println("ACTION-ID :::: " + mapMessage.getString("action"));
			if (Action.CREATED.toString().equalsIgnoreCase(mapMessage.getString("action"))){
			  if (obs.getConcept().getId().compareTo(HIV_VIRAL_LOAD_ID) == 0) {

				System.out.println("********** START PROCESS MESSAGE ****************");

                Form form = Context.getFormService().getForm(FORM_ID);
                Patient patient = Context.getPatientService().getPatient(obs.getPersonId());
                Concept concept_164596 = Context.getConceptService().getConceptByUuid("164596AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                Concept concept_1305 = Context.getConceptService().getConceptByUuid("1305AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                Concept concept_1301 = Context.getConceptService().getConceptByUuid("1301AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                Concept concept_1306 = Context.getConceptService().getConceptByUuid("1306AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
				Concept concept_856 = Context.getConceptService().getConceptByUuid("856AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
				//Concept concept_lastViralLoad = Context.getConceptService().getConceptByUuid("CI0050030AAAAAAAAAAAAAAAAAAAAAAAAAAA");
				//Concept concept_lastViralLoadDate = Context.getConceptService().getConceptByUuid("163281AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

				

                Obs obs2 = new Obs(patient, concept_856, null, null);
                obs2.setValueNumeric(obs.getValueNumeric() > 0 ? obs.getValueNumeric() : 0);
				obs2.setObsDatetime(new Date());
				obs2.setGroupMembers(null);
				obs2.setLocation(defaultLocation);


				Obs obs3 = new Obs(patient, concept_1305, null, null);
				obs3.setValueCoded(obs.getValueNumeric() > 0 ? concept_1301 : concept_1306);
				obs3.setObsDatetime(new Date());
				obs3.setLocation(defaultLocation);
				obs3.setGroupMembers(null);

				Obs obs4 = new Obs(patient, concept_164596, null, null);
				double finalValue = Math.round((Math.log(obs.getValueNumeric()) / Math.log(10)) * 100.0) / 100.0;
				obs4.setValueNumeric(finalValue);
				obs4.setObsDatetime(new Date());
				obs4.setLocation(defaultLocation);
				obs4.setGroupMembers(null);


			    /*Obs obs5 = new Obs(patient, concept_lastViralLoad, null, null);
                obs5.setValueText(obs.getValueNumeric().toString());
				obs5.setObsDatetime(new Date());
				obs5.setGroupMembers(null);
				obs5.setLocation(defaultLocation);

				Obs obs6 = new Obs(patient, concept_lastViralLoadDate, null, null);
                obs6.setValueDatetime(obs.getDateCreated());
				obs6.setObsDatetime(new Date());
				obs6.setGroupMembers(null);
				obs6.setLocation(defaultLocation);*/

                Set<Obs> obsList = new HashSet<>();
                obsList.add(obs2);
                obsList.add(obs3);
				obsList.add(obs4);

                EncounterType encounterType = new EncounterType(ENCOUNTER_TYPE_ID);
                Encounter encounter = new Encounter();
                encounter.setForm(form);
                encounter.setPatient(patient);
                encounter.setEncounterType(encounterType);
				encounter.setEncounterDatetime(new Date());
				encounter.setLocation(defaultLocation);
                Encounter encounterSaved = Context.getEncounterService().saveEncounter(encounter);
				
				obs2.setEncounter(encounterSaved);
				obs3.setEncounter(encounterSaved);
				obs4.setEncounter(encounterSaved);
				//obs5.setEncounter(encounterSaved);
				//obs6.setEncounter(encounterSaved);
				obsService.saveObs(obs2, userUuid);
				obsService.saveObs(obs3, userUuid);
				obsService.saveObs(obs4, userUuid);
				//obsService.saveObs(obs5, userUuid);
				//obsService.saveObs(obs6, userUuid);
				//time = 1;
				System.out.println("********** END PROCESS MESSAGE ****************");
			}
	}}
}

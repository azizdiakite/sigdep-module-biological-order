package org.openmrs.module.biologicalorder;

import java.util.Date;
import javax.jms.MapMessage;
import javax.jms.Message;

import org.openmrs.event.EventListener;
import org.openmrs.module.DaemonToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.EncounterRole;
import org.openmrs.EncounterType;
import org.openmrs.Form;
import org.openmrs.Location;
import org.openmrs.Obs;
import org.openmrs.Order;
import org.openmrs.Patient;
import org.openmrs.Provider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.APIException;
import org.openmrs.api.ObsService;
import org.openmrs.api.context.Context;
import org.openmrs.api.context.Daemon;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;

@Component
public class OrderResultEventListener implements EventListener {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	private static final int HIV_VIRAL_LOAD_ID = 165275;
	
	//private static final int HIV_VIRAL_LOAD_ID = 164429
	
	private static final Integer FORM_ID = 5;
	
	private static final int ENCOUNTER_TYPE_ID = 8;
	
	private static final int REQUEST_EXAM_ID = 20;
	
	private DaemonToken daemonToken;
	
	@Autowired
	DbSessionFactory sessionFactory;
	
	private DbSession getSession() {
		return sessionFactory.getCurrentSession();
	}
	
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
		Double grossViralLoadInDouble = 0.0;
		boolean isDoubleValue = false;
		
		Location defaultLocation = Context.getLocationService().getDefaultLocation();
		
		System.out.println("CONCEPT-ID :::: " + obs.getConcept().getId());
		System.out.println("CONDITION :::: " + obs.getConcept().getId().compareTo(HIV_VIRAL_LOAD_ID));
		System.out.println("ACTION-ID :::: " + mapMessage.getString("action"));
		System.out.println("OBS-UUID :::: " + obs.getUuid());
		System.out.println("OBS-ENCOUNTER :::: " + obs.getEncounter());
		System.out.println("message" + mapMessage);
		System.out.println("ENCOUNTER-TYPE-ID ::::" + obs.getEncounter().getEncounterType().getEncounterTypeId());
		System.out.println("ENCOUNTER-ID" + obs.getEncounter().getEncounterType().getEncounterTypeId());
		if ((obs.getConcept().getId().compareTo(HIV_VIRAL_LOAD_ID) == 0)
		        && (obs.getEncounter().getEncounterType().getEncounterTypeId() == REQUEST_EXAM_ID)) {
			System.out.println("********** START PROCESS MESSAGE ****************");
			
			/*Obs latestObs = getLastBiologicalObs(obs.getPersonId());
			
			if (latestObs != null) {
				System.out.println("********** DIFFRENT DE NULL :))))) ****************");
				System.out.println("ENCOUNTER-ID" + latestObs.getUuid());
			}*/
			
			Form form = Context.getFormService().getForm(FORM_ID);
			Patient patient = Context.getPatientService().getPatient(obs.getPersonId());
			Concept concept_164596 = Context.getConceptService().getConceptByUuid("164596AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept concept_1305 = Context.getConceptService().getConceptByUuid("1305AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept concept_Detectable = Context.getConceptService()
			        .getConceptByUuid("1301AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept concept_Undetectabe = Context.getConceptService().getConceptByUuid(
			    "1306AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept concept_856 = Context.getConceptService().getConceptByUuid("856AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept concept_accession_number = Context.getConceptService().getConceptByUuid(
			    "162086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept gross_hiv_viral_load = Context.getConceptService().getConceptByUuid(
			    "CI0050051AAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept date_reception_date = Context.getConceptService().getConceptByUuid(
			    "CI0050052AAAAAAAAAAAAAAAAAAAAAAAAAAA");
			EncounterRole encounterRole = Context.getEncounterService().getEncounterRole(2);
			Provider provider = Context.getProviderService().getProvider(1);
			
			//Concept concept_lastViralLoad = Context.getConceptService().getConceptByUuid("CI0050030AAAAAAAAAAAAAAAAAAAAAAAAAAA");
			//Concept concept_lastViralLoadDate = Context.getConceptService().getConceptByUuid("163281AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			
			Order order = obs.getEncounter().getOrders().iterator().next();
			System.out.println("ORDER-ACCESSION-NUMBER :::: " + order.getAccessionNumber());
			
			try {
				grossViralLoadInDouble = Double.parseDouble(obs.getValueText());
				isDoubleValue = true;
			}
			catch (Exception e) {
				System.out.println("EXCEPTION OCCURED ::: " + obs.getValueText());
			}
			
			Obs obs2 = new Obs(patient, concept_856, null, null);
			obs2.setValueNumeric(isDoubleValue ? grossViralLoadInDouble : 49);
			obs2.setObsDatetime(new Date());
			obs2.setGroupMembers(null);
			obs2.setLocation(defaultLocation);
			
			Obs obs3 = new Obs(patient, concept_1305, null, null);
			obs3.setValueCoded(isDoubleValue == true ? concept_Detectable : concept_Undetectabe);
			obs3.setObsDatetime(new Date());
			obs3.setLocation(defaultLocation);
			obs3.setGroupMembers(null);
			
			Obs obs4 = new Obs(patient, concept_164596, null, null);
			if (isDoubleValue) {
				double finalValue = Math.round((Math.log(grossViralLoadInDouble) / Math.log(10)) * 100.0) / 100.0;
				obs4.setValueNumeric(finalValue);
				obs4.setObsDatetime(new Date());
				obs4.setLocation(defaultLocation);
				obs4.setGroupMembers(null);
			}
			
			Obs obs5 = new Obs(patient, concept_accession_number, null, null);
			obs5.setValueText(order.getAccessionNumber());
			obs5.setObsDatetime(new Date());
			obs5.setLocation(defaultLocation);
			obs5.setGroupMembers(null);
			
			Obs obs6 = new Obs(patient, gross_hiv_viral_load, null, null);
			obs6.setValueText(obs.getValueText());
			obs6.setObsDatetime(new Date());
			obs6.setLocation(defaultLocation);
			obs6.setGroupMembers(null);
			
			Obs obs7 = new Obs(patient, date_reception_date, null, null);
			obs7.setValueDatetime(new Date());
			obs7.setObsDatetime(new Date());
			obs7.setLocation(defaultLocation);
			obs7.setGroupMembers(null);
			
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
			
			EncounterType encounterType = new EncounterType(ENCOUNTER_TYPE_ID);
			Encounter encounter = new Encounter();
			encounter.setForm(form);
			encounter.setPatient(patient);
			encounter.setEncounterType(encounterType);
			encounter.setEncounterDatetime(obs.getObsDatetime());
			encounter.setLocation(defaultLocation);
			encounter.setProvider(encounterRole, provider);
			Encounter encounterSaved = Context.getEncounterService().saveEncounter(encounter);
			
			obs2.setEncounter(encounterSaved);
			obs3.setEncounter(encounterSaved);
			if (isDoubleValue) {
				obs4.setEncounter(encounterSaved);
			}
			obs5.setEncounter(encounterSaved);
			obs6.setEncounter(encounterSaved);
			obs7.setEncounter(encounterSaved);
			
			obsService.saveObs(obs2, userUuid);
			obsService.saveObs(obs3, userUuid);
			if (isDoubleValue) {
				obsService.saveObs(obs4, userUuid);
			}
			obsService.saveObs(obs5, userUuid);
			obsService.saveObs(obs6, userUuid);
			obsService.saveObs(obs7, userUuid);
			
			System.out.println("********** END PROCESS MESSAGE ****************");
		}
	}
	
	public Obs getLastBiologicalObs(Integer personId) throws APIException {
		String hql = "SELECT * FROM obs o JOIN encounter e ON e.encounter_id = o.encounter_id WHERE e.encounter_type = 8 AND DATE(o.date_created) = CURDATE() AND o.person_id = "
		        + personId;
		return (Obs) getSession().createQuery(hql).uniqueResult();
	}
	
}

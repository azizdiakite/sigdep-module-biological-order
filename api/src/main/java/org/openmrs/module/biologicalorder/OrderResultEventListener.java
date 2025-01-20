package org.openmrs.module.biologicalorder;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

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
import org.openmrs.Patient;
import org.openmrs.Provider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.ObsService;
import org.openmrs.api.context.Context;
import org.openmrs.api.context.Daemon;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;

@Component
public class OrderResultEventListener implements EventListener {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	private static final int HIV_VIRAL_LOAD_ID = 165275;
		
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

	Location defaultLocation = new Location();

	Patient patient = new Patient();

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
	
	private Date removeTime(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		return cal.getTime();
	}
	
	private void processMessage(Message message) throws Exception {
		
		MapMessage mapMessage = (MapMessage) message;
		String uuid = mapMessage.getString("uuid");
		String userUuid = mapMessage.getString("userUuid");
		ObsService obsService = Context.getObsService();
		Obs obs = Context.getObsService().getObsByUuid(uuid);
		Double grossViralLoadInDouble = 0.0;
		boolean isDoubleValue = false;
		TimeZone.setDefault(TimeZone.getTimeZone("GMT+0"));

		if ((obs.getConcept().getId().compareTo(HIV_VIRAL_LOAD_ID) == 0)
		        && (obs.getEncounter().getEncounterType().getEncounterTypeId() == REQUEST_EXAM_ID)) {

			patient = Context.getPatientService().getPatient(obs.getPersonId());
			defaultLocation =  Context.getLocationService().getDefaultLocation();

			try {
				grossViralLoadInDouble = Double.parseDouble(obs.getValueText());
				isDoubleValue = true;
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}

			Obs viralLoad = createObs(getConceptByUuid("856AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"));
			viralLoad.setValueNumeric(isDoubleValue ? grossViralLoadInDouble : 49);

			Obs viralLoadQualitative = createObs(getConceptByUuid("1305AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"));
			viralLoadQualitative.setValueCoded(isDoubleValue ? getConceptByUuid("1301AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") : getConceptByUuid("1306AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"));

			Obs viralLoadLog = createObs(getConceptByUuid("164596AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"));
			if (isDoubleValue) {
				double finalValue = Math.round((Math.log(grossViralLoadInDouble) / Math.log(10)) * 100.0) / 100.0;
				viralLoadLog.setValueNumeric(finalValue);
			}

			Obs accessionNumber = createObs(getConceptByUuid("162086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"));
			accessionNumber.setValueText(obs.getEncounter().getOrders().iterator().next().getAccessionNumber());

			Obs grossViralLoad = createObs(getConceptByUuid("CI0050051AAAAAAAAAAAAAAAAAAAAAAAAAAA"));
			grossViralLoad.setValueText(obs.getValueText());

			Obs releasedDate = createObs(getConceptByUuid("CI0050052AAAAAAAAAAAAAAAAAAAAAAAAAAA"));
			releasedDate.setValueDatetime(obs.getObsDatetime());

			Encounter encounterSaved = createEncounter();
			viralLoad.setEncounter(encounterSaved);
			viralLoadQualitative.setEncounter(encounterSaved);
			accessionNumber.setEncounter(encounterSaved);
			grossViralLoad.setEncounter(encounterSaved);
			releasedDate.setEncounter(encounterSaved);
			
			obsService.saveObs(viralLoad, userUuid);
			obsService.saveObs(viralLoadQualitative, userUuid);
			obsService.saveObs(accessionNumber, userUuid);
			obsService.saveObs(grossViralLoad, userUuid);
			obsService.saveObs(releasedDate, userUuid);
			if (isDoubleValue) {
				viralLoadLog.setEncounter(encounterSaved);
				obsService.saveObs(viralLoadLog, userUuid);
			}
		}
	}

	private static Concept getConceptByUuid(String conceptUUID) {
		return Context.getConceptService().getConceptByUuid(conceptUUID);
	}

	private Encounter createEncounter() {
		EncounterType encounterType = new EncounterType(ENCOUNTER_TYPE_ID);
		Form form = Context.getFormService().getForm(FORM_ID);
		EncounterRole encounterRole = Context.getEncounterService().getEncounterRole(2);
		Provider provider = Context.getProviderService().getProvider(1);
		Encounter encounter = new Encounter();
		encounter.setForm(form);
		encounter.setPatient(patient);
		encounter.setEncounterType(encounterType);
		Date encounterDate = new Date();
		encounter.setEncounterDatetime(removeTime(encounterDate));
		encounter.setLocation(defaultLocation);
		encounter.setProvider(encounterRole, provider);
		return Context.getEncounterService().saveEncounter(encounter);
	}

	private Obs createObs(Concept concept) {
		Obs obs = new Obs(patient, concept, removeTime(new Date()), defaultLocation);
		obs.setGroupMembers(null);
		return obs;
	}
}

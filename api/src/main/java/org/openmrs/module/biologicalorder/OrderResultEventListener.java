package org.openmrs.module.biologicalorder;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;

import javax.jms.MapMessage;
import javax.jms.Message;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import org.openmrs.api.APIException;
import org.openmrs.api.ObsService;
import org.openmrs.api.context.Context;
import org.openmrs.api.context.Daemon;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.event.EventListener;
import org.openmrs.module.DaemonToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderResultEventListener implements EventListener {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	private static final String HIV_VIRAL_LOAD_ID = "CI0050051AAAAAAAAAAAAAAAAAAAAAAAAAAA";
	
	private static final String CONCEPT_RECEPTION_DATE = "165284AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
	
	private static final String CONCEPT_TECHNICAL_VALIDATION_DATE = "165283AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
	
	private static final Integer FORM_ID = 5;
	
	private static final int ENCOUNTER_TYPE_ID = 8;
	
	private static final int REQUEST_EXAM_ID = 20;
	
	private static final int DETECTABLE_THRESHOLD = 19;
	
	private static final String FEMALE_GENDER = "F";
	
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
	
	private Date removeTime(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		return cal.getTime();
	}
	
	private Date removeCurrentDateTime() {
		return removeTime(new Date());
	}
	
	private void processMessage(Message message) throws Exception {
		
		MapMessage mapMessage = (MapMessage) message;
		
		String uuid = mapMessage.getString("uuid");
		String userUuid = mapMessage.getString("userUuid");
		
		ObsService obsService = Context.getObsService();
		Obs obs = Context.getObsService().getObsByUuid(uuid);
		Integer encounterId = obs.getEncounter().getEncounterId();
		Double grossViralLoadInDouble = 0.0;
		boolean isDoubleValue = false;
		
		Location defaultLocation = Context.getLocationService().getDefaultLocation();
		System.out.println("CONDITION :::: " + obs.getConcept().getUuid().equalsIgnoreCase(HIV_VIRAL_LOAD_ID));
		
		TimeZone.setDefault(TimeZone.getTimeZone("GMT+0"));
		if ((obs.getConcept().getUuid().equalsIgnoreCase(HIV_VIRAL_LOAD_ID))
		        && (obs.getEncounter().getEncounterType().getEncounterTypeId() == REQUEST_EXAM_ID)) {
			System.out.println("********** START PROCESS MESSAGE ****************");
			Patient patient = Context.getPatientService().getPatient(obs.getPersonId());
			Form form = Context.getFormService().getForm(FORM_ID);
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
			Concept released_date = Context.getConceptService().getConceptByUuid("CI0050052AAAAAAAAAAAAAAAAAAAAAAAAAAA");
			
			Concept concept_pregnancy_status = Context.getConceptService().getConceptByUuid(
			    "5272AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept concept_breast_feeding_child = Context.getConceptService().getConceptByUuid(
			    "164764AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			Concept nonApplicable = Context.getConceptService().getConceptByUuid("163581AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			
			Concept concept_collection_request_date = Context.getConceptService().getConceptByUuid(
			    "CI0050005AAAAAAAAAAAAAAAAAAAAAAAAAAA");
			
			Concept concept_collection_date = Context.getConceptService().getConceptByUuid(
			    "165052AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			
			Concept concept_sample_type = Context.getConceptService().getConceptByUuid(
			    "CI0050007AAAAAAAAAAAAAAAAAAAAAAAAAAA");
			
			Concept concept_date_reception = Context.getConceptService().getConceptByUuid(
			    "165284AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			
			Concept concept_date_validation_technique = Context.getConceptService().getConceptByUuid(
			    "165283AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
			
			EncounterRole encounterRole = Context.getEncounterService().getEncounterRole(2);
			Provider provider = Context.getProviderService().getProvider(1);
			
			Order order = obs.getEncounter().getOrders().iterator().next();
			
			boolean isSameResult = checkDuplicateAccessionNumber(patient, concept_accession_number,
			    order.getAccessionNumber());
			System.out.println("IS SAME RESULT (DUPLICATE) : " + isSameResult + " FOR ACCESSION NUMBER : "
			        + order.getAccessionNumber());
			if (isSameResult) {
				return;
			}
			
			try {
				grossViralLoadInDouble = Double.parseDouble(obs.getValueText());
				isDoubleValue = true;
			}
			catch (Exception e) {
				grossViralLoadInDouble = 19.0;
				System.out.println(e.getMessage());
				System.out.println("EXCEPTION OCCURED ::: " + obs.getValueText());
			}
			
			Obs obs2 = new Obs(patient, concept_856, null, null);
			obs2.setValueNumeric(isDoubleValue ? grossViralLoadInDouble : DETECTABLE_THRESHOLD);
			obs2.setObsDatetime(removeCurrentDateTime());
			obs2.setGroupMembers(null);
			obs2.setLocation(defaultLocation);
			
			Obs obs3 = new Obs(patient, concept_1305, null, null);
			obs3.setValueCoded(grossViralLoadInDouble > DETECTABLE_THRESHOLD ? concept_Detectable : concept_Undetectabe);
			System.out.println("GROSS VIRAL LOAD IN DOUBLE : " + grossViralLoadInDouble);
			obs3.setObsDatetime(removeCurrentDateTime());
			obs3.setLocation(defaultLocation);
			obs3.setGroupMembers(null);
			
			Obs obs4 = new Obs(patient, concept_164596, null, null);
			if (isDoubleValue) {
				double finalValue = Math.round((Math.log(grossViralLoadInDouble) / Math.log(10)) * 100.0) / 100.0;
				obs4.setValueNumeric(finalValue);
				obs4.setObsDatetime(removeCurrentDateTime());
				obs4.setLocation(defaultLocation);
				obs4.setGroupMembers(null);
			}
			
			Obs obs5 = new Obs(patient, concept_accession_number, null, null);
			obs5.setValueText(order.getAccessionNumber());
			obs5.setObsDatetime(removeCurrentDateTime());
			obs5.setLocation(defaultLocation);
			obs5.setGroupMembers(null);
			
			Obs obs6 = new Obs(patient, gross_hiv_viral_load, null, null);
			obs6.setValueText(obs.getValueText());
			obs6.setObsDatetime(removeCurrentDateTime());
			obs6.setLocation(defaultLocation);
			obs6.setGroupMembers(null);
			
			Obs obs7 = new Obs(patient, released_date, null, null);
			obs7.setValueDatetime(obs.getObsDatetime());
			obs7.setObsDatetime(removeCurrentDateTime());
			obs7.setLocation(defaultLocation);
			obs7.setGroupMembers(null);
			
			Obs obs8 = new Obs(patient, released_date, null, null);
			obs8.setValueDatetime(obs.getObsDatetime());
			obs8.setObsDatetime(removeCurrentDateTime());
			obs8.setLocation(defaultLocation);
			obs8.setGroupMembers(null);
			
			EncounterType encounterType = new EncounterType(ENCOUNTER_TYPE_ID);
			Encounter encounter = new Encounter();
			encounter.setForm(form);
			encounter.setPatient(patient);
			encounter.setEncounterType(encounterType);
			
			Date encounterDate = new Date();
			
			encounter.setEncounterDatetime(removeTime(encounterDate));
			
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
			obs8.setEncounter(obs.getEncounter());
			
			obsService.saveObs(obs2, userUuid);
			obsService.saveObs(obs3, userUuid);
			if (isDoubleValue) {
				obsService.saveObs(obs4, userUuid);
			}
			obsService.saveObs(obs5, userUuid);
			obsService.saveObs(obs6, userUuid);
			obsService.saveObs(obs7, userUuid);
			obsService.saveObs(obs8, userUuid);
			
			if (patient.getGender().equalsIgnoreCase(FEMALE_GENDER)) {
				
				Obs latestPregnancy = getLastObservation(concept_pregnancy_status.getConceptId(), obs.getPersonId());
				Obs latestFeedingChild = getLastObservation(concept_breast_feeding_child.getConceptId(), obs.getPersonId());
				
				Obs obsPregnancy = new Obs(patient, concept_pregnancy_status, null, null);
				obsPregnancy.setValueCoded(latestPregnancy == null ? nonApplicable : latestPregnancy.getValueCoded());
				obsPregnancy.setObsDatetime(removeCurrentDateTime());
				obsPregnancy.setGroupMembers(null);
				obsPregnancy.setLocation(defaultLocation);
				
				Obs obsFeedingChild = new Obs(patient, concept_breast_feeding_child, null, null);
				obsFeedingChild.setValueCoded(latestFeedingChild == null ? nonApplicable : latestFeedingChild
				        .getValueCoded());
				obsFeedingChild.setObsDatetime(removeCurrentDateTime());
				obsFeedingChild.setGroupMembers(null);
				obsFeedingChild.setLocation(defaultLocation);
				
				obsFeedingChild.setEncounter(encounterSaved);
				obsPregnancy.setEncounter(encounterSaved);
				obsService.saveObs(obsPregnancy, userUuid);
				obsService.saveObs(obsFeedingChild, userUuid);
				
			} else {
				Obs obsPregnancy = new Obs(patient, concept_pregnancy_status, null, null);
				obsPregnancy.setValueCoded(nonApplicable);
				obsPregnancy.setObsDatetime(removeCurrentDateTime());
				obsPregnancy.setGroupMembers(null);
				obsPregnancy.setLocation(defaultLocation);
				
				Obs obsFeedingChild = new Obs(patient, concept_breast_feeding_child, null, null);
				obsFeedingChild.setValueCoded(nonApplicable);
				obsFeedingChild.setObsDatetime(removeCurrentDateTime());
				obsFeedingChild.setGroupMembers(null);
				obsFeedingChild.setLocation(defaultLocation);
				
				obsFeedingChild.setEncounter(encounterSaved);
				obsPregnancy.setEncounter(encounterSaved);
				obsService.saveObs(obsPregnancy, userUuid);
				obsService.saveObs(obsFeedingChild, userUuid);
			}
			
			//Sample type
			Obs latestSampleTye = getLastObservation(concept_sample_type.getConceptId(), obs.getPersonId());
			if (latestSampleTye != null) {
				Obs obs10 = new Obs(patient, concept_sample_type, null, null);
				obs10.setValueCoded(latestSampleTye.getValueCoded());
				obs10.setObsDatetime(removeCurrentDateTime());
				obs10.setLocation(defaultLocation);
				obs10.setGroupMembers(null);
				obs10.setEncounter(encounterSaved);
				obsService.saveObs(obs10, userUuid);
			}
			
			//Collection date
			Obs latestCollectionDate = getObsFromOriginalEncounter(obs, concept_collection_request_date.getUuid());
			
			if (latestCollectionDate != null) {
				Obs obs9 = new Obs(patient, concept_collection_date, null, null);
				obs9.setValueDatetime(latestCollectionDate.getValueDatetime());
				obs9.setObsDatetime(new Date());
				obs9.setLocation(defaultLocation);
				obs9.setGroupMembers(null);
				obs9.setEncounter(encounterSaved);
				obsService.saveObs(obs9, userUuid);
			}
			
			// Date de reception
			Obs dateReception = getObsFromOriginalEncounter(obs, CONCEPT_RECEPTION_DATE);
			if (dateReception != null) {
				Obs obs11 = new Obs(patient, concept_date_reception, null, null);
				obs11.setValueDatetime(dateReception.getValueDatetime());
				obs11.setObsDatetime(removeCurrentDateTime());
				obs11.setLocation(defaultLocation);
				obs11.setGroupMembers(null);
				obs11.setEncounter(encounterSaved);
				obsService.saveObs(obs11, userUuid);
			}
			
			// Date de validation technique
			Obs dateValidationTechnique = getObsFromOriginalEncounter(obs, CONCEPT_TECHNICAL_VALIDATION_DATE);
			if (dateValidationTechnique != null) {
				Obs obs12 = new Obs(patient, concept_date_validation_technique, null, null);
				obs12.setValueDatetime(dateValidationTechnique.getValueDatetime());
				obs12.setObsDatetime(removeCurrentDateTime());
				obs12.setLocation(defaultLocation);
				obs12.setGroupMembers(null);
				obs12.setEncounter(encounterSaved);
				obsService.saveObs(obs12, userUuid);
			}
			
			System.out.println("********** END PROCESS MESSAGE ****************");
		}
	}
	
	/**
	 * Vérifie s'il existe déjà un obs concept_accession_number avec la même valeur pour ce patient.
	 * Utilise ObsService directement pour éviter les problèmes de lazy loading Hibernate.
	 * 
	 * @return true si un doublon est trouvé, false sinon
	 */
	public static boolean checkDuplicateAccessionNumber(
	        Patient patient,
	        Concept concept_accession_number,
	        String accessionNumber) {

	    if (accessionNumber == null) {
	        return false;
	    }
	    List<Obs> obsList = Context.getObsService().getObservationsByPersonAndConcept(
	            patient, concept_accession_number);
	    System.out.println("ACCESSION NUMBER OBS COUNT FOR PATIENT : " + obsList.size());
	    return obsList.stream().anyMatch(o -> accessionNumber.equals(o.getValueText()));
	}
	
	public static boolean checkObsWithConceptAndTodayDate(List<Encounter> encounters, Concept released_date, Date releasedDate, String newResult) {
        // Parcourir chaque rencontre
        for (Encounter encounter : encounters) {

            for (Obs obs : encounter.getObs()) {

                if (obs.getConcept().getUuid().compareToIgnoreCase(HIV_VIRAL_LOAD_ID) == 0) {

					Optional<Obs> releasedDateObs = encounter.getObs().stream().filter(o -> o.getConcept().getUuid().equals(released_date.getUuid())).findFirst();
					if (releasedDateObs.isPresent()) {

						return getDateWithoutTime(releasedDateObs.get().getValueDatetime()).equals(getDateWithoutTime(releasedDate)) && obs.getValueText().equals(newResult) ;
					}
                }
            }
        }
        return false;
    }
	
	public Obs getLastBiologicalObs(Integer personId) throws APIException {
		String hql = "SELECT * FROM obs o JOIN encounter e ON e.encounter_id = o.encounter_id WHERE e.encounter_type = 8 AND DATE(o.date_created) = CURDATE() AND o.person_id = "
		        + personId;
		return (Obs) getSession().createQuery(hql).uniqueResult();
	}
	
	public Obs getLastPreleventDate(Integer personId) throws APIException {
		String hql = "SELECT * FROM obs o JOIN encounter e ON e.encounter_id = o.encounter_id WHERE e.encounter_type = 8 AND DATE(o.date_created) = CURDATE() AND o.person_id = "
		        + personId;
		return (Obs) getSession().createQuery(hql).uniqueResult();
	}
	
	private static Date getDateWithoutTime(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}
	
	public Obs getLastObservation(Integer conceptId, Integer patientId) {
        // Charger le concept
        Concept concept = Context.getConceptService().getConcept(conceptId);
        if (concept == null) {
            throw new IllegalArgumentException("Concept with ID " + conceptId + " does not exist.");
        }

        // Charger toutes les observations du patient pour ce concept
        List<Obs> observations = Context.getObsService().getObservationsByPersonAndConcept(
                Context.getPersonService().getPerson(patientId),
                concept
        );

        // Vérifier si des observations existent
        if (observations == null || observations.isEmpty()) {
            return null; // Pas d'observations trouvées
        }

        // Trouver la dernière observation (triée par date décroissante)
        Obs lastObs = observations.stream()
                .max((o1, o2) -> o1.getObsDatetime().compareTo(o2.getObsDatetime()))
                .orElse(null);

        return lastObs;
    }
	
	private Obs getObsFromOriginalEncounter(Obs obs, String uuidRecherche) {
		System.out.println("IN METHOD getObsFromOriginalEncounter");
		Integer encounterId = obs.getEncounter().getEncounterId();
		Encounter freshEncounter = Context.getEncounterService().getEncounter(encounterId);
		Context.evictFromSession(freshEncounter);
		freshEncounter = Context.getEncounterService().getEncounter(encounterId);
        return  freshEncounter.getAllObs().stream()
                .filter(inObs -> inObs.getConcept().getUuid().equalsIgnoreCase(uuidRecherche))
                .findFirst()
                .orElse(null);
    }
}

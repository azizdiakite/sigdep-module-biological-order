/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.biologicalorder.api.impl;

import org.openmrs.*;
import org.openmrs.api.UserService;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.biologicalorder.api.BiologicalOrderService;
import org.openmrs.module.biologicalorder.api.dao.BiologicalOrderDao;

import java.util.Date;
import java.util.List;

public class BiologicalOrderServiceImpl extends BaseOpenmrsService implements BiologicalOrderService {
	
	BiologicalOrderDao dao;
	
	UserService userService;
	
	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setDao(BiologicalOrderDao dao) {
		this.dao = dao;
	}
	
	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	
	@Override
	public Obs getLatestObsByConcept(Person person, Concept concept, Date date, Location location,
	        EncounterType encounterType) {
		return dao.getLatestObsByConcept(person, concept, date, location, encounterType);
	}
	
	@Override
	public Encounter getLatestEncounter(EncounterType encounterType, Date date) {
		return dao.getLatestEncounter(encounterType, date);
	}
	
	@Override
	public List<Encounter> getLatestPatientEncounters(EncounterType encounterType, Date startDate, Date endDate) {
		return dao.getLatestPatientEncounters(encounterType, startDate, endDate);
	}
}

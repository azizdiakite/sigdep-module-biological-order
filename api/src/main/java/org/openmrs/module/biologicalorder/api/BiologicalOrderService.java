/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.biologicalorder.api;

import org.openmrs.*;
import org.openmrs.annotation.Authorized;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.biologicalorder.BiologicalOrderConfig;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * The main service of this module, which is exposed for other modules. See
 * moduleApplicationContext.xml on how it is wired up.
 */
public interface BiologicalOrderService extends OpenmrsService {
	
	/**
	 * @param concept
	 * @param date
	 * @param location
	 * @param encounterType
	 * @return Obs
	 */
	
	@Authorized(BiologicalOrderConfig.MODULE_PRIVILEGE)
	@Transactional
	Obs getLatestObsByConcept(Person person, Concept concept, Date date, Location location, EncounterType encounterType);
	
	/**
	 * @param encounterType
	 * @param date
	 * @return Encounter
	 */
	@Authorized(BiologicalOrderConfig.MODULE_PRIVILEGE)
	@Transactional
	Encounter getLatestEncounter(EncounterType encounterType, Date date);
	
}

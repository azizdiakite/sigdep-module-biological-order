/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.biologicalorder;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.ConceptDatatype;
import org.openmrs.ConceptMap;
import org.openmrs.ConceptNumeric;
import org.openmrs.Obs;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;
import org.openmrs.event.EventListener;
import org.openmrs.module.BaseModuleActivator;
import org.openmrs.module.DaemonToken;
import org.openmrs.module.DaemonTokenAware;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.openmrs.event.Event;
import org.openmrs.event.Event.Action;

/**
 * This class contains the logic that is run every time this module is either started or shutdown
 */
public class BiologicalOrderActivator extends BaseModuleActivator implements ApplicationContextAware, DaemonTokenAware {
	
	private Log log = LogFactory.getLog(BiologicalOrderActivator.class);
	
	private static ApplicationContext applicationContext;
	
	private EventListener eventListener;
	
	private DaemonToken daemonToken;
	
	/**
	 * @see #started()
	 */
	public void started() {
		log.info("Started BiologicalOrder");
		fixNumericConcepts();
		eventListener = new OrderResultEventListener(daemonToken);
		Event.subscribe(Obs.class, Action.CREATED.name(), eventListener);
	}
	
	/**
	 * @see #shutdown()
	 */
	public void shutdown() {
		log.info("Shutdown BiologicalOrder");
		if (eventListener != null) {
			Event.unsubscribe(Obs.class, Action.CREATED, eventListener);
		}
	}
	
	// TO DO . we should fix the metadata issue from OCL or the DB  ie some Numeric concepts have no Concept Numeric metadata 
	private void fixNumericConcepts() {
		List<String> uuids = Arrays.asList("164429AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "164430AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
		    "5497AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "730AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
		    "163545AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
		uuids.forEach(uuid -> {
			ConceptService conceptService = Context.getConceptService();
			Concept c = conceptService.getConceptByUuid(uuid);
			ConceptNumeric cn = conceptService.getConceptNumeric(c.getConceptId());
			ConceptDatatype dt = c.getDatatype();
			if (dt.isNumeric() && cn == null) {
				ConceptNumeric newCn = new ConceptNumeric(c);
				Set<ConceptMap> filteredMaps = new HashSet<>();
				Set<Integer> mappedTermIds = new HashSet<>();
				for (ConceptMap cm : newCn.getConceptMappings()) {
					//if we already have a mapping to this term, reject it this map
					if (cm.getConceptReferenceTerm().getId() != null
					        && mappedTermIds.add(cm.getConceptReferenceTerm().getId())) {
						filteredMaps.add(cm);
					}	
				}
				newCn.setConceptMappings(filteredMaps);
				for (ConceptMap cMap : newCn.getConceptMappings()) {
					cMap.setConcept(newCn);
				}	
				conceptService.saveConcept(newCn);
			}
		});
	}
	
	@Override
	public void setDaemonToken(DaemonToken token) {
		this.daemonToken = token;
	}
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}
}

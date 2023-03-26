/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.biologicalorder.api.dao;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.openmrs.*;
import org.openmrs.api.context.Context;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.biologicalorder.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository("biologicalorder.BiologicalOrderDao")
public class BiologicalOrderDao {
	
	@Autowired
	DbSessionFactory sessionFactory;
	
	private DbSession getSession() {
		return sessionFactory.getCurrentSession();
	}

	public Obs getLatestObsByConcept(Person person, Concept concept, Date date, Location location, EncounterType encounterType) {
		Criteria criteria = getSession().createCriteria(Obs.class, "o");
		return (Obs) criteria.createAlias("o.encounter", "e")
				.add(Restrictions.eq("e.encounterType", encounterType))
				.add(Restrictions.eq("o.person", person))
				.add(Restrictions.eq("o.concept", concept))
				.add(Restrictions.le("o.obsDatetime", date))
				.add(Restrictions.le("o.location", location))
				.addOrder(Order.desc("o.obsDatetime")).setMaxResults(1).uniqueResult();
	}

	public Encounter getLatestEncounter(EncounterType encounterType, Date date) {
		return (Encounter) getSession().createCriteria(Encounter.class)
				.add(Restrictions.eq("encounterType", encounterType))
				.add(Restrictions.eq("encounterDatetime", date))
				.addOrder(Order.desc("encounterDatetime")).setMaxResults(1).uniqueResult();
	}
}

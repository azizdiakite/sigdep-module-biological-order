package org.openmrs.module.biologicalorder.web.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.hibernate.Query;
import org.openmrs.Order;
import org.openmrs.api.APIException;
import org.openmrs.api.OrderService;
import org.openmrs.api.context.Context;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.response.ResponseException;
import org.openmrs.module.webservices.rest.web.v1_0.controller.BaseRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class CustomObsController extends BaseRestController {
	
	@Autowired
	DbSessionFactory sessionFactory;
	
	private DbSession getSession() {
		return sessionFactory.getCurrentSession();
	}
	
	@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/customobs")
    @ResponseBody
    public Map<String, Object> getOrdersMap() throws ResponseException {
        List<Order> orders = getOrders();
        List<OrderDto> ordersData = orders.stream()
        .map(order -> new OrderDto(
                order.getId(),
                order.getPatient().getPerson().getUuid(),
                order.getEncounter().getUuid(),
                order.getPatient().getPatientIdentifier().getIdentifier(),
                order.getFulfillerStatus().toString(),
                order.getFulfillerComment()
        ))
        .collect(Collectors.toList());
         Map<String, Object> response = new HashMap<>();
        response.put("total", ordersData.size());
        response.put("orders", ordersData);

        return response;
    }
	
	@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/updateNotifOrder/{orderId}")
	@ResponseBody
	public void reviseOrder(@PathVariable("orderId") Integer orderId) {
		OrderService orderService = Context.getOrderService();
		Order order = orderService.getOrder(orderId);
		orderService.voidOrder(order, "NOTIFICATION");
	}
	
	public List<Order> getOrders() throws APIException {
		// Requête HQL pour récupérer les ordres selon les critères
		String hql = "FROM Order o WHERE o.dateVoided iS NULL AND o.fulfillerStatus NOT IN ('REQUESTED', 'IN_PROGRESS','RECEIVED') ORDER BY o.dateCreated DESC";
		
		// Exécuter la requête
		Query query = (Query) getSession().createQuery(hql);
		
		// Renvoyer les résultats sous forme de liste
		return query.list();
	}
	
	private class OrderDto {
		
		private Integer orderId;
		
		private String personUuid;
		
		private String encounterUuid;
		
		private String patientName;
		
		private String status;
		
		private String comment;
		
		public OrderDto(Integer orderId, String personUuid, String encounterUuid, String patientName, String status,
		    String comment) {
			this.orderId = orderId;
			this.personUuid = personUuid;
			this.encounterUuid = encounterUuid;
			this.patientName = patientName;
			this.status = status;
			this.comment = comment;
		}
		
		public String getPersonUuid() {
			return personUuid;
		}
		
		public void setPersonUuid(String personUuid) {
			this.personUuid = personUuid;
		}
		
		public String getEncounterUuid() {
			return encounterUuid;
		}
		
		public void setEncounterUuid(String encounterUuid) {
			this.encounterUuid = encounterUuid;
		}
		
		public Integer getOrderId() {
			return orderId;
		}
		
		public void setOrderId(Integer orderId) {
			this.orderId = orderId;
		}
		
		public String getPatientName() {
			return patientName;
		}
		
		public void setPatientName(String patientName) {
			this.patientName = patientName;
		}
		
		public String getStatus() {
			return status;
		}
		
		public void setStatus(String status) {
			this.status = status;
		}
		
		public String getComment() {
			return comment;
		}
		
		public void setComment(String comment) {
			this.comment = comment;
		}
	}
}

package org.openmrs.module.biologicalorder.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JREmptyDataSource;

import java.io.InputStream;
import java.util.Base64;
import java.util.Map;

import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.v1_0.controller.BaseRestController;

@Controller
public class JasperReportController extends BaseRestController {
	
	@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/report", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) throws Exception {
		
		try {
			
			InputStream reportStream = this.getClass().getClassLoader().getResourceAsStream("assets/report.jasper");
			
			JasperPrint jasperPrint = JasperFillManager.fillReport(reportStream, payload, new JREmptyDataSource());
			byte[] pdfBytes = JasperExportManager.exportReportToPdf(jasperPrint);
			String base64String = Base64.getEncoder().encodeToString(pdfBytes);
			
			return ResponseEntity.ok(base64String);
			
		}
		catch (Exception e) {
			
			System.out.println("EXECPTION" + e.getMessage());
			return ResponseEntity.badRequest().body(null);
		}
		
	}
}

package org.openmrs.module.biologicalorder.api;

import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperExportManager;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.io.FileInputStream;
import java.io.InputStream;

@Service
public class JasperReportService {
	
	public ByteArrayOutputStream generatePdf(String jasperFilePath, Map<String, Object> parameters) throws Exception {
		// Charger le fichier Jasper
		InputStream jasperStream = new FileInputStream(jasperFilePath);
		
		// Remplir le rapport avec des paramètres et des données (si applicable)
		JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, parameters);
		
		// Exporter le rapport en PDF dans un flux de sortie
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
		
		return outputStream;
	}
}

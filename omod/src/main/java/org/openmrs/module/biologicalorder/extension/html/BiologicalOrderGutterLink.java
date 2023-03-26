package org.openmrs.module.biologicalorder.extension.html;

import org.openmrs.api.context.Context;
import org.openmrs.module.biologicalorder.BiologicalOrderConfig;
import org.openmrs.module.web.extension.LinkExt;

public class BiologicalOrderGutterLink extends LinkExt {
	
	@Override
	public String getLabel() {
		return Context.getMessageSourceService().getMessage("Demande d'examen");
	}
	
	@Override
	public String getUrl() {
		return "module/biologicalorder/biologicalorder.form#/";
	}
	
	@Override
	public String getRequiredPrivilege() {
		return BiologicalOrderConfig.MODULE_PRIVILEGE;
	}
}

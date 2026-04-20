<%@ include file="/WEB-INF/template/include.jsp"%> <%@ include
file="/WEB-INF/template/header.jsp"%> <%--
<h2><spring:message code="biologicalorder.title" /></h2>
--%>

<openmrs:htmlInclude
  file="${pageContext.request.contextPath}/moduleResources/biologicalorder/styles.css"
/>
<openmrs:htmlInclude
  file="${pageContext.request.contextPath}/moduleResources/biologicalorder/main.css"
/>

<div id="root"></div>

<openmrs:htmlInclude
  file="${pageContext.request.contextPath}/moduleResources/biologicalorder/runtime.js"
/>
<openmrs:htmlInclude
  file="${pageContext.request.contextPath}/moduleResources/biologicalorder/polyfills.js"
/>
<openmrs:htmlInclude
  file="${pageContext.request.contextPath}/moduleResources/biologicalorder/main.js"
/>

<%@ include file="/WEB-INF/template/footer.jsp"%>

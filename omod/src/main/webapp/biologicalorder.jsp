<%@ include file="/WEB-INF/template/include.jsp"%>

<%@ include file="/WEB-INF/template/header.jsp"%>

<%--<h2><spring:message code="biologicalorder.title" /></h2>--%>

<openmrs:htmlInclude
        file="${pageContext.request.contextPath}/moduleResources/biologicalorder/styles.ef46db3751d8e999.css"
/>
<openmrs:htmlInclude
        file="${pageContext.request.contextPath}/moduleResources/biologicalorder/main.ef46db3751d8e999.css"
/>
<%--<body>--%>
<div id="root"></div>
<%--<br/>--%>
<%--<table>--%>
<%--  <tr>--%>
<%--   <th>User Id</th>--%>
<%--   <th>Username</th>--%>
<%--  </tr>--%>
<%--  <c:forEach var="user" items="${users}">--%>
<%--      <tr>--%>
<%--        <td>${user.userId}</td>--%>
<%--        <td>${user.systemId}</td>--%>
<%--      </tr>		--%>
<%--  </c:forEach>--%>
<%--</table>--%>

<openmrs:htmlInclude
        file="${pageContext.request.contextPath}/moduleResources/biologicalorder/runtime.010460a976245417.js"
/>
<openmrs:htmlInclude
        file="${pageContext.request.contextPath}/moduleResources/biologicalorder/polyfills.8ee688643d37928f.js"
/>
<openmrs:htmlInclude
        file="${pageContext.request.contextPath}/moduleResources/biologicalorder/main.2788da078395a4d4.js"
/>

<%@ include file="/WEB-INF/template/footer.jsp"%>

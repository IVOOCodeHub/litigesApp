<%@LANGUAGE="VBSCRIPT" %>
<!--#include file="fctgene.asp" -->
<%
' vérification de la session
if trim(session("typeutil"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=Délai de connection expiré, merci de vous ré-identifier..." 
	response.redirect(txtpageerreur)
end if

' Données reçues
message=trim(request.querystring("message"))
societe=trim(request.querystring("societe"))
unit_org=trim(request.querystring("unit_org"))
ss_unit_org=trim(request.querystring("ss_unit_org"))
libelle=trim(request.querystring("libelle"))
description_detaillee=trim(request.querystring("description_detaillee"))
classement_niv1=trim(request.querystring("classement_niv1"))
classement_niv2=trim(request.querystring("classement_niv2")) : if classement_niv2="" then classement_niv2="0"
classement_niv3=trim(request.querystring("classement_niv3")) : if classement_niv3="" then classement_niv3="0"

' Liste des sociétés
txtsql="SELECT code_compta,nomsociete from societes WHERE active=1 ORDER BY nomsociete"
set listesoc = Server.CreateObject("ADODB.Recordset")
listesoc.ActiveConnection = dsnemployes
listesoc.Source = txtsql
listesoc.Open()

' Liste des unités d'organisation
txtsql="SELECT libelle FROM uo_unites ORDER BY libelle"
set listeunit = Server.CreateObject("ADODB.Recordset")
listeunit.ActiveConnection = dsnemployes
listeunit.Source = txtsql
listeunit.Open()

' liste des sous-unités
txtsql="SELECT libelle FROM uo_sous_unites ORDER BY libelle"
set listessunit = Server.CreateObject("ADODB.Recordset")
listessunit.ActiveConnection = dsnemployes
listessunit.Source = txtsql
listessunit.Open()

' Liste des armoires (niv1)
txtsql="SELECT * FROM courrier_classe1 WHERE cle_utilisateur=2 ORDER BY libelle"
set liste_class1 = Server.CreateObject("ADODB.Recordset")
liste_class1.ActiveConnection = dsnivoo
liste_class1.Source = txtsql
liste_class1.Open()

' Liste des tiroirs (niv2)
txtsql="SELECT * FROM courrier_classe2 WHERE cle_utilisateur=2 "
if classement_niv1<>"-1" and classement_niv1<>"" then txtsql=txtsql & " AND cle_classement1=" & classement_niv1 & " "
txtsql=txtsql & "ORDER BY libelle"
set liste_class2 = Server.CreateObject("ADODB.Recordset")
liste_class2.ActiveConnection = dsnivoo
liste_class2.Source = txtsql
liste_class2.Open()

' Liste des classeur (niv3)
txtsql="SELECT * FROM courrier_classe3 WHERE cle_utilisateur=2 "
if classement_niv2<>"-1" then txtsql=txtsql & " AND cle_classement2=" & classement_niv2 & " "
txtsql=txtsql & "ORDER BY libelle"
set liste_class3 = Server.CreateObject("ADODB.Recordset")
liste_class3.ActiveConnection = dsnivoo
liste_class3.Source = txtsql
liste_class3.Open()

%>
<html>
<head>
<title>Gestion DOSSIERS</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="Styles/gboutons.css" type="text/css">
<script language="JavaScript">
<!--
function chargepage(){
	document.getElementById("societe").focus();
}

function change_classement(){
	txturl="dossier_ajout0.asp";
	txturl=txturl + "?societe="+document.getElementById("societe").value;
	txturl=txturl + "&unit_org="+document.getElementById("unit_org").value;
	txturl=txturl + "&ss_unit_org="+document.getElementById("ss_unit_org").value;
	txturl=txturl + "&libelle="+document.getElementById("libelle").value;
	txturl=txturl + "&description_detaillee="+document.getElementById("description_detaillee").value;
	txturl=txturl + "&classement_niv1="+document.getElementById("classement_niv1").value;
	txturl=txturl + "&classement_niv2="+document.getElementById("classement_niv2").value;
	txturl=txturl + "&classement_niv3="+document.getElementById("classement_niv3").value;
	location.href=txturl;
}

function verif(f){
	if(f.societe.value=="-1"){
		alert("Merci de saisir la société à laquelle le dossier sera attaché.");
		f.societe.focus();
		return false;
	}
	if(f.unit_org.value=="-1"){
		alert("Merci de saisir l'unité d'organisation gérant le dossier.");
		f.unit_org.focus();
		return false;
	}
	if(f.ss_unit_org.value=="-1"){
		alert("Merci de saisir la sous-unité d'organisation gérant le dossier.");
		f.ss_unit_org.focus();
		return false;
	}
	if(f.libelle.value==""){
		alert("Merci de saisir un libellé !");
		f.libelle.focus();
		return false;
	}
	if(f.description_detaillee.value==""){
		alert("Merci de saisir une description du dossier !");
		f.description_detaillee.focus();
		return false;
	}
	if(f.classement_niv1.value=="-1"){
		alert("Merci de sélectionner un classement niv.1 !");
		f.classement_niv1.focus();
		return false;
	}
	/*if(f.classement_niv2.value=="-1"){
		alert("Merci de sélectionner un classement niv.2 !");
		f.classement_niv2.focus();
		return false;
	}
	if(f.classement_niv3.value=="-1"){
		alert("Merci de sélectionner un classement niv.3 !");
		f.classement_niv3.focus();
		return false;
	}*/
	return true;
}

function ouvreaide(){
	window.open("aide.asp?sujet=none","","top=10,left=10,height=740,width=980,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no,resizable");
}

// -->
</script>
</head>

<body onload="chargepage()">
<div id="ltitrepage" style="position:absolute; width:100%; height:10px; z-index:1; left:0; top:0"> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr valign="middle"> 
			<td width="10%" height="15" align="left"><img src="images/ivoo-logo.jpg" width="123" height="47" style="cursor:pointer;" onClick="location.href='menugeneral.asp'"></td>
			<td width="83%" height="15" bgcolor="<%=session("couleursite")%>" align="center"><span class="titrepage"><b><%=nomappli%></b> | DOSSIERS | NOUVEAU DOSSIER</span></td>
			<td width="7%" height="15" align="right"><input type="button" name="baide" value="Aide" class="baide" onClick="ouvreaide()"></td>
		</tr>
	</table>
	<hr align="center">
</div>

<form name="saisie" method="post" action="dossier_ajout1.asp" onsubmit="return(verif(this))">
	<div id="lsaisie" style="text-align:<%=attr_text_align%>; position:absolute; width:100%; height:600px; z-index:1; left:0; top:120;"> 
		<table width="50%" border="0" cellspacing="4" cellpadding="0">
			<tr>
				<td width="50%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Société :&nbsp;</font></b></td>
				<td width="50%" bgcolor="#FFFFCC" align="left">
					<select name="societe">
						<option value="-1" selected>Choisir</option>
						<%while not listesoc.eof%>
							<option value="<%=listesoc("code_compta")%>" <%=valsel(trim(listesoc("code_compta")),societe)%>><%=listesoc("nomsociete")%></option>
						<%listesoc.movenext : wend%>
					</select>
				</td>
			</tr>
			<tr>
				<td width="50%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Unité organisation :&nbsp;</font></b></td>
				<td width="50%" bgcolor="#FFFFCC" align="left">
					<select name="unit_org">
						<option value="-1" selected>Choisir</option>
						<%while not listeunit.eof%>
							<option value="<%=listeunit("libelle")%>" <%=valsel(trim(listeunit("libelle")),unit_org)%>><%=listeunit("libelle")%></option>
						<%listeunit.movenext : wend%>
					</select>
				</td>
			</tr>
			<tr>
				<td width="50%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Sous-unité organisation :&nbsp;</font></b></td>
				<td width="50%" bgcolor="#FFFFCC" align="left">
					<select name="ss_unit_org">
						<option value="-1" selected>Choisir</option>
						<%while not listessunit.eof%>
							<option value="<%=listessunit("libelle")%>" <%=valsel(trim(listessunit("libelle")),ss_unit_org)%>><%=listessunit("libelle")%></option>
						<%listessunit.movenext : wend%>
					</select>
				</td>
			</tr>
			<tr>
				<td width="50%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Libellé :&nbsp;</font></b></td>
				<td width="50%" bgcolor="#FFFFCC" align="left"><input type="text" name="libelle" size="50" maxlength="50" value="<%=libelle%>"></td>
			</tr>
			<tr>
				<td width="50%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Description détailée :&nbsp;</font></b></td>
				<td width="50%" bgcolor="#FFFFCC" align="left"><textarea name="description_detaillee" cols="50" rows="5"><%=description_detaillee%></textarea></td>
			</tr>
			<tr>
				<td width="50%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Classement niv.1 (armoire) :&nbsp;</font></b></td>
				<td width="50%" bgcolor="#FFFFCC" align="left">
					<select name="classement_niv1" onchange="change_classement()">
						<option value="-1" selected>Choisir</option>
						<%while not liste_class1.eof%>
							<option value="<%=liste_class1("cle")%>" <%=valsel(trim(liste_class1("cle")),classement_niv1)%>><%=liste_class1("libelle")%></option>
						<%liste_class1.movenext : wend%>
					</select>
				</td>
			</tr>
			<tr>
				<td width="50%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Classement niv.2 (tiroir) :&nbsp;</font></b></td>
				<td width="50%" bgcolor="#FFFFCC" align="left">
					<select name="classement_niv2" onchange="change_classement()">
						<option value="-1" selected>Choisir</option>
						<%while not liste_class2.eof%>
							<option value="<%=liste_class2("cle")%>" <%=valsel(trim(liste_class2("cle")),classement_niv2)%>><%=liste_class2("libelle")%></option>
						<%liste_class2.movenext : wend%>
					</select>
				</td>
			</tr>
			<tr>
				<td width="50%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Classement niv.3 (classeur) :&nbsp;</font></b></td>
				<td width="50%" bgcolor="#FFFFCC" align="left">
					<select name="classement_niv3">
						<option value="-1" selected>Choisir</option>
						<%while not liste_class3.eof%>
							<option value="<%=liste_class3("cle")%>" <%=valsel(trim(liste_class3("cle")),classement_niv3)%>><%=liste_class3("libelle")%></option>
						<%liste_class3.movenext : wend%>
					</select>
				</td>
			</tr>
			<tr>
				<td colspan="2" bgcolor="#FFFFFF" align="center">&nbsp;</td>
			</tr>
			<%if message<>"" then%>
				<tr>
					<td colspan="2" bgcolor="#FFFFFF" align="center"><font face="arial" color="#990000"><%=message%></font></td>
				</tr>
				<tr>
					<td colspan="2" bgcolor="#FFFFFF" align="center">&nbsp;</td>
				</tr>
			<%end if%>
			<tr>
				<td colspan="2" bgcolor="#FFFFFF" align="center"><input type="submit" name="btnok" value="Ok" class="bok">&nbsp;&nbsp;<input type="button" name="btretour" value="Annuler" class="bretour" onclick="location.href='dossier_liste.asp'"></td>
			</tr>
		</table>
	</div>
</form>

</body>
</html>
<%
listesoc.Close()
listeunit.Close()
listessunit.Close()
liste_class1.Close()
liste_class2.Close()
liste_class3.Close()
%>
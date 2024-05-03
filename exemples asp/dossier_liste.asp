<%@LANGUAGE="VBSCRIPT" %>
<!--#include file="fctgene.asp" -->
<%
' vérification de la session
if trim(session("typeutil"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=Délai de connection expiré, merci de vous ré-identifier..." 
	response.redirect(txtpageerreur)
end if

' Initialisation
change_champ_tri=0 ' par défaut, pas de changement de champ de tri

' Données reçues
filtre_statut=trim(request.querystring("filtre_statut"))
filtre_societe=trim(request.querystring("filtre_societe"))
champ_tri=trim(request.querystring("champ_tri"))
filtre_unit_org=trim(request.querystring("filtre_unit_org"))
filtre_ss_unit_org=trim(request.querystring("filtre_ss_unit_org"))

' Traitement des filtres
if filtre_statut="" then ' filtre demandé non
	if session("doss_filtre_statut")="" then ' filtre existe non
		filtre_statut="EN_COURS"
		session("doss_filtre_statut")=filtre_statut
	else ' filtre existe oui
		filtre_statut=session("doss_filtre_statut")
	end if ' filtre existe ?
else ' filtre demandé oui
	session("doss_filtre_statut")=filtre_statut
end if ' filtre demandé ?

if filtre_societe="" then ' filtre demandé non
	if session("doss_filtre_societe")="" then ' filtre existe non
		filtre_societe="TOUTES"
		session("doss_filtre_societe")="TOUTES"
	else ' filtre existe oui
		filtre_societe=session("doss_filtre_societe")
	end if ' filtre existe ?
else ' filtre demandé oui
	session("doss_filtre_societe")=filtre_societe
end if ' filtre demandé ?

if filtre_unit_org="" then ' filtre demandé non
	if session("doss_filtre_unit_org")="" then ' filtre existe non
		filtre_unit_org="TOUTES"
		session("doss_filtre_unit_org")="TOUTES"
	else ' filtre existe oui
		filtre_unit_org=session("doss_filtre_unit_org")
	end if ' filtre existe ?
else ' filtre demandé oui
	session("doss_filtre_unit_org")=filtre_unit_org
end if ' filtre demandé ?

if filtre_ss_unit_org="" then ' filtre demandé non
	if session("doss_filtre_ss_unit_org")="" then ' filtre existe non
		filtre_ss_unit_org="TOUTES"
		session("doss_filtre_ss_unit_org")="TOUTES"
	else ' filtre existe oui
		filtre_ss_unit_org=session("doss_filtre_ss_unit_org")
	end if ' filtre existe ?
else ' filtre demandé oui
	session("doss_filtre_ss_unit_org")=filtre_ss_unit_org
end if ' filtre demandé ?

' Traitement champ tri 
if champ_tri="" then ' tri demandé non
	if session("doss_champ_tri")="" then ' tri existe non
		champ_tri="cle"
		session("doss_champ_tri")="cle"
		ordre_tri="ASC"
		session("doss_ordre_tri")="ASC"
	else ' tri existe oui
		champ_tri=session("doss_champ_tri")
	end if ' tri existe ?
else ' tri demandé oui
	if champ_tri<>session("doss_champ_tri") then ' changement de champ de tri oui
		ordre_tri="ASC"
		session("doss_ordre_tri")="ASC"
	else ' changement de champ de tri non
		if session("doss_ordre_tri")="ASC" then ordre_tri="DESC" else ordre_tri="ASC"
		session("doss_ordre_tri")=ordre_tri
	end if ' changement de champ de tri ?
	session("doss_champ_tri")=champ_tri
end if ' tri demandé ?

' Liste des dossiers
txtsql="SELECT d.cle,societe,libelle,description_detaillee,date_creation,auteur_creation,statut,date_statut,auteur_statut "
txtsql=txtsql & "FROM dossiers AS d LEFT JOIN dossiers_matricules_autorises AS a ON d.cle=a.cle_dossier "
txtsql=txtsql & "WHERE 1=1 "
if filtre_unit_org<>"TOUTES" then txtsql=txtsql & "AND unit_org='" & filtre_unit_org & "' "
if filtre_ss_unit_org<>"TOUTES" then txtsql=txtsql & "AND ss_unit_org='" & filtre_ss_unit_org & "' "
if filtre_statut<>"TOUS" then txtsql=txtsql & "AND statut='" & filtre_statut & "' "
if filtre_societe<>"TOUTES" then txtsql=txtsql & "AND societe='" & filtre_societe & "' "
txtsql=txtsql & "GROUP BY d.cle,societe,libelle,description_detaillee,date_creation,auteur_creation,statut,date_statut,auteur_statut "
txtsql=txtsql & "ORDER by " & champ_tri & " " & ordre_tri
set liste = Server.CreateObject("ADODB.Recordset")
liste.ActiveConnection = dsnivoo
liste.Source = txtsql
liste.Open()

' Liste des sociétés
txtsql="SELECT code_compta,nomsociete from societes WHERE active=1 ORDER BY nomsociete"
set listesoc = Server.CreateObject("ADODB.Recordset")
listesoc.ActiveConnection = dsnemployes
listesoc.Source = txtsql
listesoc.Open()

' liste des unités
if session("typeutil")="D" or session("matricule")="1001" then ' utilisateur direction ou AC  : droit d'accès total oui
	txtsql="SELECT libelle FROM uo_unites ORDER BY libelle"
else ' droit d'accès total non
	txtsql="SELECT libelle FROM uo_unites WHERE libelle='" & session("util_unit_org") & "' ORDER BY libelle"
end if ' droit d'accès total ?
set listeunit = Server.CreateObject("ADODB.Recordset")
listeunit.ActiveConnection = dsnemployes
listeunit.Source = txtsql
listeunit.Open()

' liste des sous unités
if session("typeutil")="D" or session("matricule")="1001" then ' utilisateur direction ou AC  : droit d'accès total oui
	txtsql="SELECT libelle FROM uo_sous_unites ORDER BY libelle"
else ' droit d'accès total non
	txtsql="SELECT libelle FROM uo_sous_unites WHERE libelle='" & session("util_ss_unit_org") & "' ORDER BY libelle"
end if ' droit d'accès total ?
set listessunit = Server.CreateObject("ADODB.Recordset")
listessunit.ActiveConnection = dsnemployes
listessunit.Source = txtsql
listessunit.Open()
%>
<html>
<head>
<title>Gestion DOSSIERS</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="Styles/gboutons.css" type="text/css">
<script language="JavaScript">
<!--

function changesociete(valsoc){
	location.href="dossier_liste.asp?filtre_societe="+valsoc;
}

function changestatut(valstat){
	location.href="dossier_liste.asp?filtre_statut="+valstat;
}

function changeunitorg(valunit){
	location.href="dossier_liste.asp?filtre_unit_org="+valunit;
}

function changessunitorg(valssunit){
	location.href="dossier_liste.asp?filtre_ss_unit_org="+valssunit;
}

function tri(nomchamp){
	location.href="dossier_liste.asp?champ_tri="+nomchamp;
}

function modif(cle){
	location.href="dossier_modif0.asp?cle="+cle;
}

function surligne(self) {
	self.oldbgcolor=self.style.backgroundColor;
	self.style.backgroundColor="#cccccc";
}

function desurligne(self) {
	self.style.backgroundColor=self.oldbgcolor;
}

function ouvreaide(){
	window.open("aide.asp?sujet=none","","top=10,left=10,height=740,width=980,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no,resizable");
}

// -->
</script>
</head>

<body>
<div id="ltitrepage" style="position:absolute; width:100%; height:10px; z-index:1; left:0; top:0"> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr valign="middle"> 
			<td width="10%" height="15" align="left"><img src="images/ivoo-logo.jpg" width="123" height="47" style="cursor:pointer;" onClick="location.href='menugeneral.asp'"></td>
			<td width="83%" height="15" bgcolor="<%=session("couleursite")%>" align="center"><span class="titrepage"><b><%=nomappli%></b> | DOSSIERS | GESTION</span></td>
			<td width="7%" height="15" align="right"><input type="button" name="baide" value="Aide" class="baide" onClick="ouvreaide()"></td>
		</tr>
	</table>
	<hr align="center">
</div>

<div id="lfiltre" style="position:absolute; width:1320; height:10px; z-index:1; left:50; top:60"> 
  <table width="1200" border="0" cellspacing="4" cellpadding="0">
		<tr>
			<td width="12.5%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Société :&nbsp;</font></b></td>
			<td width="12.5%" bgcolor="#FFFFCC">
				<select name="societe" onchange="changesociete(this.value)">
					<option value="TOUTES" selected>Toutes</option>
					<%while not listesoc.eof%>
						<option value="<%=listesoc("code_compta")%>" <%=valsel(trim(listesoc("code_compta")),filtre_societe)%>><%=listesoc("nomsociete")%></option>
					<%listesoc.movenext : wend%>
				</select>
			</td>
			<td width="12.5%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Statut :&nbsp;</font></b></td>
			<td width="12.5%" bgcolor="#FFFFCC">
				<select name="statut" onchange="changestatut(this.value)">
					<option value="TOUS" selected>Tous</option>
					<option value="EN_COURS" <%=valsel("EN_COURS",filtre_statut)%>>Dossiers en cours</option>
					<option value="SUSPENDU" <%=valsel("SUSPENDU",filtre_statut)%>>Dossiers suspendus</option>
					<option value="CLOTURE" <%=valsel("CLOTURE",filtre_statut)%>>Dossiers cl&ocirc;tur&eacute;s</option>
				</select>
			</td>
			<td width="12.5%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">Unité org. :&nbsp;</font></b></td>
			<td width="12.5%" bgcolor="#FFFFCC">
				<select name="unit_org" onchange="changeunitorg(this.value)">
					<%if session("typeutil")="D" or session("matricule")="1001" then response.write("<option value=""TOUTES"" selected>Toutes</option>")
					while not listeunit.eof%>
						<option value="<%=listeunit("libelle")%>" <%=valsel(trim(listeunit("libelle")),filtre_unit_org)%>><%=listeunit("libelle")%></option>
					<%listeunit.movenext : wend%>
				</select>
			</td>
			<td width="12.5%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="arial" color="#FFFFFF">SS Unité org. :&nbsp;</font></b></td>
			<td width="12.5%" bgcolor="#FFFFCC">
				<select name="ss_unit_org" onchange="changessunitorg(this.value)">
					<%if session("typeutil")="D" or session("matricule")="1001" then response.write("<option value=""TOUTES"" selected>Toutes</option>")
					while not listessunit.eof%>
						<option value="<%=listessunit("libelle")%>" <%=valsel(trim(listessunit("libelle")),filtre_ss_unit_org)%>><%=listessunit("libelle")%></option>
					<%listessunit.movenext : wend%>
				</select>
			</td>
		</tr>
  </table>
</div>

<div id="lentete" style="position:absolute; width:1320; height:10px; z-index:1; left:50; top:100"> 
  <table width="1300" border="0" cellspacing="4" cellpadding="0">
		<tr bgcolor="<%=couleurfondcase%>">
			<td width="4%"><a href="#" onclick="tri('cle')"><b><font face="arial" color="#FFFFFF">Code</font></b></a></td>
			<td width="8%"><a href="#" onclick="tri('societe')"><b><font face="arial" color="#FFFFFF">Société</font></b></a></td>
			<td width="26%"><a href="#" onclick="tri('libelle')"><b><font face="arial" color="#FFFFFF">Libellé</font></b></a></td>
			<td width="50%"><a href="#" onclick="tri('description_detaillee')"><b><font face="arial" color="#FFFFFF">Description</font></b></a></td>
			<td width="6%"><a href="#" onclick="tri('date_creation')"><b><font face="arial" color="#FFFFFF">Date</font></b></a></td>
			<td width="6%"><a href="#" onclick="tri('statut')"><b><font face="arial" color="#FFFFFF">Stat.</font></b></a></td>
		</tr>
  </table>
</div>

<div id="lliste" style="position:absolute; width:1320; height:600px; z-index:1; left:50; top:120; overflow:auto"> 
  <table width="1300" border="0" cellspacing="4" cellpadding="0">
		<%while not liste.eof
		description_detaillee=trim(liste("description_detaillee"))
		if len(description_detaillee)>90 then description_detaillee=left(liste("description_detaillee"),90) & "..."
		%>
			<tr bgcolor="#FFFFCC" onClick="modif(<%=liste("cle")%>)" style="cursor:pointer" onMouseOver="surligne(this)" onMouseOut="desurligne(this)">
				<td width="4%"><font face="arial" size="2"><%=liste("cle")%></font></td>
				<td width="8%"><font face="arial" size="2"><%=liste("societe")%></font></td>
				<td width="26%"><font face="arial" size="2"><%=liste("libelle")%></font></td>
				<td width="50%"><font face="arial" size="2"><%=description_detaillee%></font></td>
				<td width="6%"><font face="arial" size="2"><%=left(liste("date_creation"),10)%></font></td>
				<td width="6%"><font face="arial" size="2"><%=left(liste("statut"),8)%></font></td>
			</tr>
		<%liste.movenext : wend%>
  </table>
</div>

<div id="lnav" style="text-align:<%=attr_text_align%>; position:absolute; width:1320; height:10px; z-index:1; left:50; top:725"> 
  <table width="1300" border="0" cellspacing="4" cellpadding="0">
		<tr> 
			<td width="50%" align="left"><input type="button" value="Nouveau" onclick="location.href='dossier_ajout0.asp'" class="bmenu"></td>
			<td width="50%" align="right"><input type="button" value="Retour" onclick="location.href='menudossier.asp'" class="bretour"></td>
		</tr>
  </table>
</div>

</body>
</html>
<%
liste.Close()
listesoc.Close()
listeunit.Close()
listessunit.Close()
%>
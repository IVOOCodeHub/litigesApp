<%@LANGUAGE="VBSCRIPT" %>
<!--#include file="fctgene.asp" -->
<!--#include file="fctgene_courrier.asp" -->
<%
' vérification de la session
if trim(session("typeutil"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=Délai de connection expiré, merci de vous ré-identifier..." 
	response.redirect(txtpageerreur)
end if

' Initialisation
trip="<b><font face=""Wingdings 3"" size=""2"">p</font></b>"
triq="<b><font face=""Wingdings 3"" size=""2"">q</font></b>"

' Données reçues
sens=trim(request.querystring("sens"))
if sens="" then sens=session("cour_adistrib_sens") ' initialisée à E comme entrant par la page menu_courrier.asp
session("cour_adistrib_sens")=sens
select case sens
	case "E" ' courrier entrant demandé 
		display_btn_sortant="inline"
		display_btn_entrant="none"
		display_btn_interne="inline"
		sens_affiche="ENTRANTS"
	case "S" ' courrier sortant demandé 
		display_btn_entrant="inline"
		display_btn_sortant="none"
		display_btn_interne="inline"
		sens_affiche="SORTANTS"
	case "I" ' courrier interne demandé 
		display_btn_entrant="inline"
		display_btn_sortant="inline"
		display_btn_interne="none"
		sens_affiche="INTERNES"
end select


f_societe=trim(request.querystring("f_societe"))
if f_societe="" then ' filtre demandé non
	if trim(session("courrier_f_societe"))="" then ' filtre existant non
		f_societe="-1"
	else ' filtre existant oui
		f_societe=trim(session("courrier_f_societe"))
	end if ' filtre existant ?
else ' filtre demandé oui
	session("courrier_f_societe")=f_societe
end if ' filtre demandé ?

f_Emetteur=trim(request.querystring("f_Emetteur"))
if f_Emetteur="" then ' filtre demandé non
	if trim(session("courrier_f_societe"))="" then ' filtre existant non
		f_Emetteur="-1"
	else ' filtre existant oui
		f_Emetteur=trim(session("courrier_f_societe"))
	end if ' filtre existant ?
else ' filtre demandé oui
	session("courrier_f_societe")=f_Emetteur
end if ' filtre demandé ?

' traitement tri
tri=trim(request.querystring("tri"))
if tri="" then ' tri demandé non
	if session("cour_adistrib_tri")="" then ' tri existant non
		tri="cle"
		session("cour_adistrib_tri")=tri
	else ' tri existant oui
		tri=session("cour_adistrib_tri")
	end if ' tri existant 
else ' tri demandé oui
	session("cour_adistrib_tri")=tri
end if ' tri demandé

' Liste des courriers à distribuer
txtsql="SELECT cle,societe,societe_emettrice,dh_saisie,auteur_saisie,nom_fichier,nature,ref_doc,sens,mat_mark FROM courrier WHERE statut='SAISI' AND sens='" & sens & "'"
if f_societe<>"-1" then txtsql=txtsql & "AND societe='" & f_societe & "' "
if f_Emetteur<>"-1" then txtsql=txtsql & "AND societe_emettrice='" & f_Emetteur & "' "
txtsql=txtsql & "ORDER BY " & tri
set liste = Server.CreateObject("ADODB.Recordset")
liste.ActiveConnection = dsnIVOO
liste.Source = txtsql
liste.Open()

' Liste des sociétés
txtsql="SELECT Count(cle) AS n, societe as nomsociete FROM courrier WHERE statut='SAISI' AND sens='" & sens & "' GROUP BY societe ORDER BY societe"
set listesoc = Server.CreateObject("ADODB.Recordset")
listesoc.ActiveConnection = dsnivoo
listesoc.Source = txtsql
listesoc.Open()

' Liste des Emetteur
txtsql="SELECT Count(cle) AS n, societe_emettrice as nomEmetteur FROM courrier WHERE statut='SAISI' AND sens='" & sens & "' GROUP BY societe_emettrice ORDER BY societe_emettrice"
set listeEmetteur = Server.CreateObject("ADODB.Recordset")
listeEmetteur.ActiveConnection = dsnivoo
listeEmetteur.Source = txtsql
listeEmetteur.Open()

' Initialisation compteur
n=0
nmark=0

function canal_fr(v)
select case v
	case "E"
		canal_fr="email"
	case "C"
		canal_fr="Courrier"
	case "R"
		canal_fr="Courrier recommandé"
	case "F"
		canal_fr="Fax"
	case "M"
		canal_fr="Remise mains propres"
	case else
		canal_fr="?"
	end select
end function
%>
<html>
<head>
<title>Gestion courriers</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="Styles/gboutons.css" type="text/css">
<script language="JavaScript">
<!--

function type_courrier(tc){
	if(tc=="E"){location.href="menu_courrier_a_distribuer.asp?sens=E"+"&f_societe=-1&f_Emetteur=-1";}
	if(tc=="I"){location.href="menu_courrier_a_distribuer.asp?sens=I"+"&f_societe=-1&f_Emetteur=-1";}
	if(tc=="S"){location.href="menu_courrier_a_distribuer.asp?sens=S"+"&f_societe=-1&f_Emetteur=-1";}
}

function tri(t){
	location.href="menu_courrier_a_distribuer.asp?tri="+t;
}

function Filtre(){
	location.href="menu_courrier_a_distribuer.asp?f_societe="+document.getElementById("societe").value+"&f_Emetteur="+document.getElementById("Emetteur").value;
}


function marque(c,m){
	location.href="menu_courrier_a_distribuer_marquage0.asp?cle="+c+"&mat_mark="+m;
}

function modif(c,s){
	if(s=="E"){location.href="courdistrib_entrant0.asp?cle_courrier="+c;}
	if(s=="S"){location.href="courdistrib_sortant0.asp?cle_courrier="+c;}
	if(s=="I"){location.href="courdistrib_interne0.asp?cle_courrier="+c;}
}

function surligne(self) {
	self.oldbgcolor=self.style.backgroundColor;
	self.style.backgroundColor="#cccccc";
}

function desurligne(self) {
	self.style.backgroundColor=self.oldbgcolor;
}

// -->
</script>
</head>

<body link="#FFFFFF" vlink="#FFFFFF" alink="#FFFFFF">
<div id="ltitrepage" style="position:absolute; width:100%; height:65; z-index:2; left:0; top:0"> 
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr> 
      <td width="10%" height="19" align="left"><img src="images/ivoo-logo.jpg" width="123" height="47" style="cursor:pointer;" onClick="location.href='menugeneral.asp'"></td>
      <td width="82%" height="19" bgcolor="<%=session("couleursite")%>" align="center"><span class="titrepage"><b><%=nomappli%></b> | ... | GESTION DES COURRIERS | COURRIERS <b><%=sens_affiche%></b> A DISTRIBUER</span></td>
      <td width="8%" height="19" align="right"><input type="button" name="baide" value="Aide" class="baide" onClick="ouvreaide()"></td>
    </tr>
  </table>
  <hr>
</div>


<div id="lentete" style="position:absolute; width:1420; height:15; z-index:1; left:50px; top:90px"> 
  <table width="1400" border="0" cellspacing="0" cellpadding="0">
    <tr bgcolor="<%=couleurfondcase%>">
      <td width="7%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Réf.</font></b></td>
		  <td width="12%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Destinataire</font></b></td>
      <td width="25%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Emetteur</font></b></td>
      <td width="15%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF"><a href="#" onclick="tri('dh_saisie')"><%=trip%></a>Date<a href="#" onclick="tri('dh_saisie DESC')"><%=triq%></a></font></b></td>
      <td width="16%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Pièce</font></b></td>
      <td width="22%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Ref. doc.</font></b></td>
      <td width="3%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF"><%if sens="E" then response.write("Sél")%></font></b></td>
    </tr>
  </table>
</div>


<div id="lliste" style="position:absolute; width:1420; height:500; z-index:1; left:50px; top:110px; overflow:auto; background-color: #FFFFCC; layer-background-color: #FFFFCC; border: 1px none #000000"> 
  <table width="1400" border="0" cellspacing="0" cellpadding="0">
	  <%while not liste.eof
			n=n+1
			radiobouton="<input type=""radio"" name=""radiobutton" & liste("cle") & """ value=""radiobutton"" onclick=""marque(" & liste("cle") & "," & liste("mat_mark") & ")"" "
			if liste("mat_mark")<>0 then 
				radiobouton=radiobouton & "checked>" 
				nmark=nmark+1
			else 
				radiobouton=radiobouton & ">"
			end if
			%>
			<tr bgcolor="#FFFFCC" style="cursor:pointer" onMouseOver="surligne(this)" onMouseOut="desurligne(this)" valign="top">
				<td width="7%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000" onClick="modif(<%=liste("cle")%>,'<%=liste("sens")%>')"><%=trim(liste("cle"))%></font></td>
				<td width="12%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000" onClick="modif(<%=liste("cle")%>,'<%=liste("sens")%>')"><%=left(liste("societe"),10)%></font></td>
				<td width="25%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000" onClick="modif(<%=liste("cle")%>,'<%=liste("sens")%>')"><%=liste("societe_emettrice")%></font></td>
				<td width="15%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000" onClick="modif(<%=liste("cle")%>,'<%=liste("sens")%>')"><%=liste("dh_saisie")%></font></td>
				<td width="16%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000" onClick="modif(<%=liste("cle")%>,'<%=liste("sens")%>')"><%=liste("nature")%></font></td>
				<td width="22%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000" onClick="modif(<%=liste("cle")%>,'<%=liste("sens")%>')"><%=liste("ref_doc")%></font></td>
				<%if sens="E" then 
					response.write("<td width=""3%""><font face=""Arial, Helvetica, sans-serif"" size=""2"" color=""#000000"">" & radiobouton & "</font></td>")
				else
					response.write("<td width=""3%""><font face=""Arial, Helvetica, sans-serif"" size=""2"" color=""#000000"">&nbsp;</font></td>")
				end if%>
			</tr>
	  <%liste.movenext:wend%>
  </table>
</div>


<div id="lnav" style="position:absolute; width:1420; height:20; z-index:1; left:50px; top:625px;"> 
  <table width="1400" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td width="33%"><font face="arial" color="#000000"><%=n & " courrier" & singulierpluriel(n) & " dont " & nmark & " courrier" & singulierpluriel(nmark) & " marqué" & singulierpluriel(nmark)%></font></td>
				<td width="33%">&nbsp;</td>
				<td width="34%" align="right"><input type="button" name="btnretour" value="Retour" onclick="location.href='menu_courrier.asp'" class="bretour"></td>
			</tr>
  </table>
</div>


<div id="lfiltre" style="position:absolute; width:920; height:15; z-index:1; left:50px; top:65px;"> 
  <table width="900" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td width="12%" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Destinataire :&nbsp;</font></b></td>
			<td width="24%" align="left" bgcolor="#FFFFFF">
				<select name="societe" id="societe" onchange="Filtre()">
					<option value="-1" <%=valsel("-1",f_societe)%>>Toutes</option>
					<%while not listesoc.eof%>
						<option value="<%=listesoc("nomsociete")%>" <%=valsel(listesoc("nomsociete"),f_societe)%>><%=listesoc("nomsociete") & " : " & listesoc("n")%></option>
					<%listesoc.movenext : wend%>
				</select>
			</td>
			<td width="12%" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Emetteur :&nbsp;</font></b></td>
			<td width="24%" align="left" bgcolor="#FFFFFF">
				<select name="Emetteur" id="Emetteur" onchange="Filtre()">
					<option value="-1" <%=valsel("-1",f_Emetteur)%>>Toutes</option>
					<%while not listeEmetteur.eof%>
						<option value="<%=listeEmetteur("nomEmetteur")%>" <%=valsel(listeEmetteur("nomEmetteur"),f_Emetteur)%>><%=listeEmetteur("nomEmetteur") & " : " & listeEmetteur("n")%></option>
					<%listeEmetteur.movenext : wend%>
				</select>
			</td>
			<td width="16%" align="left" bgcolor="#FFFFFF"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#000000">&nbsp</font><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">&nbsp;</font></b></td>
			<td width="16%" align="left" bgcolor="#FFFFFF"><input type="button" name="btntypcoure" value="Gérer les entrants" onclick="type_courrier('E')" style="display:<%=display_btn_entrant%>"></td>
			<td width="16%" align="left" bgcolor="#FFFFFF"><input type="button" name="btntypcours" value="Gérer les sortants" onclick="type_courrier('S')" style="display:<%=display_btn_sortant%>"></td>
			<td width="16%" align="left" bgcolor="#FFFFFF"><input type="button" name="btntypcouri" value="Gérer les internes" onclick="type_courrier('I')" style="display:<%=display_btn_interne%>"></td>
		</tr>
  </table>
</div>


</body>
</html>
<%
liste.Close()
listesoc.Close()
%>
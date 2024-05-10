<%@LANGUAGE="VBSCRIPT" %> 
<!--#include file="fctgene.asp" -->
<!--#include file="fctgene_courrier.asp" -->
<%
' vùrification de la session
if trim(session("identifiant"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=Dùlai de connection expirù, merci de vous rù-identifier..." 
	response.redirect(txtpageerreur)
end if

' initialisation
trip="<b><font face=""Wingdings 3"" size=""2"">p</font></b>"
triq="<b><font face=""Wingdings 3"" size=""2"">q</font></b>"

' donnùes reùues
code_tiers=trim(request.querystring("code"))
cle_courrier=trim(request.querystring("cle_courrier"))
tri0=trim(request.querystring("tri"))
tableatrier=trim(request.querystring("tableatrier"))

' Traitement tri
if session("tvpt_tri1")="" then tri1="cle" else tri1=session("tvpt_tri1")
if session("tvpt_tri2")="" then tri2="reference_paiement" else tri2=session("tvpt_tri2")
if tableatrier="1" then ' tri sur prev oui
	if tri0<>"" then tri1=tri0
else ' tri sur prev non
	if tri0<>"" then tri2=tri0
end if ' tri sur prev ?
session("tvpt_tri1")=tri1
session("tvpt_tri2")=tri2

' Liste des prùvisions du tiers code_tiers
txtsql="SELECT cle, societe, libelle_ecriture, debit, credit, rubrique_treso, statut, date_echeance FROM previsions "
txtsql=txtsql & "WHERE ref_source_tiers=" & code_tiers & " "
txtsql=txtsql & "AND (statut='A VALIDER' OR statut='VALIDE' OR statut='ORDO') "
txtsql=txtsql & "ORDER BY " & tri1
'response.write(txtsql) : response.end
set liste = Server.CreateObject("ADODB.Recordset")
liste.ActiveConnection = dsncompta
liste.Source = txtsql
liste.Open()

' Liste des paiements du tiers tiers
txtsql="SELECT * FROM paiements "
txtsql=txtsql & "WHERE ref_source_tiers=" & code_tiers & " "
'txtsql=txtsql & "AND statut='ENCAISSE' AND statut='DECAISSE' "
txtsql=txtsql & "ORDER BY " & tri2
set listep = Server.CreateObject("ADODB.Recordset")
listep.ActiveConnection = dsncompta
listep.Source = txtsql
listep.Open()

' Liste des budgets du tiers tiers
txtsql="SELECT cle, societe, libelle_ecriture, debit, credit, rubrique_treso, statut, date_echeance FROM budget "
txtsql=txtsql & "WHERE ref_source_tiers=" & code_tiers & " "
txtsql=txtsql & "AND (statut='BUDGET') "
txtsql=txtsql & "ORDER BY " & tri1
'response.write(txtsql) : response.end
set listeb = Server.CreateObject("ADODB.Recordset")
listeb.ActiveConnection = dsncompta
listeb.Source = txtsql
listeb.Open()


%>
<html>
<head>
<title>Visu pr&eacute;visions tiers</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="Styles/gboutons.css" type="text/css">
<script src="scripts/pr_calendrier.js" language="javascript" type="text/javascript"></script>
<script language="JavaScript">
<!--
function choisir_prev(c){
	if(confirm("Confirmez-vous l'association de la prùvision "+c+" au courrier <%=cle_courrier%> ?")){
		location.href="treso_visu_prev_tiers_assoc0.asp?cle_courrier=<%=cle_courrier%>&cle_prevision="+c;
	}
}

function choisir_budget(c){
	if(confirm("Confirmez-vous la crùation d'une prùvision ù partir de cette ligne de budget "+c+" associùe au courrier <%=cle_courrier%> ?")){
		location.href="treso_visu_prev_tiers_assoc0.asp?cle_courrier=<%=cle_courrier%>&cle_budget="+c;
	}
}

function tri(tr,ta){
	location.href="treso_visu_prev_tiers.asp?code=<%=code_tiers%>&cle_courrier=<%=cle_courrier%>&tri="+tr+"&tableatrier="+ta;
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

//-->
</script>
</head>

<body link="#FFFFFF" vlink="#FFFFFF" alink="#FFFFFF">
<div id="ltitrepage" style="text-align:center; position:absolute; width:100%; height:28px; z-index:1; left:0px; top:0px"> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr> 
			<td width="10%" height="19" align="left"><img src="images/ivoo-logo.jpg" width="123" height="47"></td>
			<td width="82%" height="19" bgcolor="<%=session("couleursite")%>" align="center"><span class="titrepage"><b><%=nomappli%></b> | ... | <b>TRESORERIE</b> | VISUALISATION PREVISIONS TIERS <%=code_tiers%></span></td>
			<td width="8%" height="19" align="right"><input type="button" name="baide" value="Aide" class="baide" onClick="ouvreaide()"></td>
		</tr>
	</table>
	<hr align="center">
</div>


<div id="lentetelisteb" style="position:absolute; width:820; height:28px; z-index:1; left:50px; top:80px"> 
	<table width="800">
		<tr bgcolor="<%=couleurfondcase%>">
			<td colspan="6"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Budget</font></b></td>
    </tr>
		<tr bgcolor="<%=couleurfondcase%>">
			<td width="11%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Sociùtù</font></b></td>
      <td width="34%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Libellù</font></b></td>
      <td width="18%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Rubrique</font></b></td>
      <td width="11%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Montant</font></b></td>
      <td width="13%" align="center"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Echùance</font></b></td>
      <td width="13%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Statut</font></b></td>
    </tr>
	</table>
</div>

<div id="llisteb" style="position:absolute; width:820; height:150px; z-index:1; left:50px; top:118px; overflow:auto; background-color:#FFFFCC"> 
	<table width="800">
		<%while not listeb.eof%>
		<tr bgcolor="#FFFFCC" onMouseOver="surligne(this)" onMouseOut="desurligne(this)" style="cursor:pointer" onclick="choisir_budget(<%=listeb("cle")%>)">
			<td width="11%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=listeb("societe")%></font></td>
      <td width="34%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=listeb("libelle_ecriture")%></font></td>
      <td width="18%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=listeb("rubrique_treso")%></font></td>
      <td width="11%" align="right"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=formatnumber(listeb("debit")+listeb("credit"))%>&nbsp;</font></td>
      <td width="13%" align="center"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=formatdatetime(listeb("date_echeance"))%></font></td>
      <td width="13%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=listeb("statut")%></font></td>
    </tr>
		<%listeb.movenext : wend%>
	</table>
</div>



<div id="lenteteliste" style="position:absolute; width:820; height:28px; z-index:1; left:50px; top:270px"> 
	<table width="800">
		<tr bgcolor="<%=couleurfondcase%>">
			<td colspan="6"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Prùvisions</font></b></td>
    </tr>
		<tr bgcolor="<%=couleurfondcase%>">
			<td width="11%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('societe',1)"><%=trip%></a>Sociùtù<a href="#" onclick="tri('societe desc',1)"><%=triq%></a></font></b></td>
      <td width="34%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('libelle_ecriture',1)"><%=trip%></a>Libellù<a href="#" onclick="tri('libelle_ecriture desc',1)"><%=triq%></a></font></b></td>
      <td width="18%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('rubrique_treso',1)"><%=trip%></a>Rubrique<a href="#" onclick="tri('rubrique_treso desc',1)"><%=triq%></a></font></b></td>
      <td width="11%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('credit',1)"><%=trip%></a>Montant<a href="#" onclick="tri('credit desc',1)"><%=triq%></a></font></b></td>
      <td width="13%" align="center"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('date_echeance',1)"><%=trip%></a>Echùance<a href="#" onclick="tri('date_echeance desc',1)"><%=triq%></a></font></b></td>
      <td width="13%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('statut',1)"><%=trip%></a>Statut<a href="#" onclick="tri('statut desc',1)"><%=triq%></a></font></b></td>
    </tr>
	</table>
</div>

<div id="lliste" style="position:absolute; width:820; height:150px; z-index:1; left:50px; top:308px; overflow:auto; background-color:#FFFFCC"> 
	<table width="800">
		<%while not liste.eof%>
		<tr bgcolor="#FFFFCC" onMouseOver="surligne(this)" onMouseOut="desurligne(this)" style="cursor:pointer" onclick="choisir_prev(<%=liste("cle")%>)">
			<td width="11%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=liste("societe")%></font></td>
      <td width="34%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=liste("libelle_ecriture")%></font></td>
      <td width="18%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=liste("rubrique_treso")%></font></td>
      <td width="11%" align="right"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=formatnumber(liste("debit")+liste("credit"))%>&nbsp;</font></td>
      <td width="13%" align="center"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=formatdatetime(liste("date_echeance"))%></font></td>
      <td width="13%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=liste("statut")%></font></td>
    </tr>
		<%liste.movenext : wend%>
	</table>
</div>

<div id="lenteteliste" style="position:absolute; width:820; height:28px; z-index:1; left:50px; top:460px"> 
	<table width="800">
		<tr bgcolor="<%=couleurfondcase%>">
			<td colspan="6"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Paiements</font></b></td>
    </tr>
		<tr bgcolor="<%=couleurfondcase%>">
			<td width="11%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('societe',2)"><%=trip%></a>Sociùtù<a href="#" onclick="tri('societe desc',2)"><%=triq%></a></font></b></td>
      <td width="34%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('libelle',2)"><%=trip%></a>Libellù<a href="#" onclick="tri('libelle desc',2)"><%=triq%></a></font></b></td>
      <td width="18%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('rubrique',2)"><%=trip%></a>Rubrique<a href="#" onclick="tri('rubrique desc',2)"><%=triq%></a></font></b></td>
      <td width="11%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('montant',2)"><%=trip%></a>Montant<a href="#" onclick="tri('montant desc',2)"><%=triq%></a></font></b></td>
      <td width="13%" align="center"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('date_echeance',2)"><%=trip%></a>Echùance<a href="#" onclick="tri('date_echeance desc',2)"><%=triq%></a></font></b></td>
      <td width="13%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"><a href="#" onclick="tri('statut',2)"><%=trip%></a>Statut<a href="#" onclick="tri('statut desc',2)"><%=triq%></a></font></b></td>
    </tr>
	</table>
</div>

<div id="lliste" style="position:absolute; width:820; height:150px; z-index:1; left:50px; top:495px; overflow:auto;"> 
	<table width="800">
		<%while not listep.eof%>
		<tr bgcolor="#FFFFCC" onMouseOver="surligne(this)" onMouseOut="desurligne(this)" style="cursor:not-allowed" onclick="//choisir_prev(<%=listep("reference_paiement")%>)">
			<td width="11%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=listep("societe")%></font></td>
      <td width="34%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=listep("libelle")%></font></td>
      <td width="18%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=listep("rubrique")%></font></td>
      <td width="11%" align="right"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=formatnumber(listep("montant"))%>&nbsp;</font></td>
      <td width="13%" align="center"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=formatdatetime(listep("date_echeance"))%></font></td>
      <td width="13%"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=listep("statut")%></font></td>
    </tr>
		<%listep.movenext : wend%>
	</table>
</div>

<div id="lfiltre" style="text-align:right; position:absolute; width:820; height:28px; z-index:1; left:50px; top:680px">
	<input type="button" name="btnfermer" value="Fermer" onclick="window.close()" class="bretour">
</div>

</body>
</html>
<%
listeb.Close()
liste.Close()
listep.Close()
%>
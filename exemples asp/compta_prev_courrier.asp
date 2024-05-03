<%@LANGUAGE="VBSCRIPT" %> 
<!--#include file="fctgene.asp" -->
<%
' vérification de la session
if trim(session("identifiant"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=Délai de connection expiré, merci de vous ré-identifier..." 
	response.redirect(txtpageerreur)
end if

' Initialisation
session("cour_util")="FINANCE"
session("compta_cle_courrier")=""
dd="01/" & sur2digits(month(date)) & "/" & year(date)
df=dateadd("d",-1,dateadd("m",1,dd))

' Données reçues
f_societe=trim(request.querystring("f_societe")) ' filtre société à afficher
f_nature=trim(request.querystring("f_nature")) ' filtre nature des courriers à afficher (chèque, notes de frais, avis, etc...)
message=trim(request.querystring("message")) ' message reçu par la page en cas de courrier sélectionner par clé et déjà assicé à une prévision par exemple

' Traitement
if f_societe="" then ' filtre société demandé non
	if trim(session("compta_f_societe"))="" then ' filtre societe existant non
		f_societe="-1"
	else ' filtre societe existant oui
		f_societe=trim(session("compta_f_societe"))
	end if ' filtre societe existant ?
else ' filtre société demandé oui
	session("compta_f_societe")=f_societe
end if ' filtre société demandé ?

if f_nature="" then ' filtre nature demandé non
	if trim(session("compta_f_nature"))="" then ' filtre nature existant non
		f_nature="-1"
	else ' filtre nature existant oui
		f_nature=trim(session("compta_f_nature"))
	end if ' filtre nature existant ?
else ' filtre nature demandé oui
	session("compta_f_nature")=f_nature
end if ' filtre nature demandé ?

' Liste des sociétés filtre
txtsql="SELECT Count(cle) AS n, societe FROM courrier "
txtsql=txtsql & "WHERE service='FINANCE' "
txtsql=txtsql & "AND statut='DISTRIBUE' "
txtsql=txtsql & "AND action='A TRAITER' "
txtsql=txtsql & "AND cle_prevision=0 "
txtsql=txtsql & "AND cle_paiement=0 "
txtsql=txtsql & "AND date_piece>'31/12/2017 23:59:59' "
if f_nature="-1" then 
	txtsql=txtsql & "AND nature<>'FACTUREC' AND nature<>'CHEQUE' AND nature<>'ACCORD PART' "
else
	txtsql=txtsql & "AND nature='" & f_nature & "' "
end if
txtsql=txtsql & "GROUP BY societe "
txtsql=txtsql & "ORDER BY societe "
set listefsoc = Server.CreateObject("ADODB.Recordset")
listefsoc.ActiveConnection = dsnivoo
listefsoc.Source = txtsql
listefsoc.Open()

' Liste des courriers distribués à traiter
txtsql="SELECT cle,societe,action,dh_saisie,auteur_saisie,service,action,commentaire,statut,nature,societe_emettrice FROM courrier "
txtsql=txtsql & "WHERE service='FINANCE' "
txtsql=txtsql & "AND statut='DISTRIBUE' "
txtsql=txtsql & "AND action='A TRAITER' "
txtsql=txtsql & "AND cle_prevision=0 "
txtsql=txtsql & "AND date_piece>'31/12/2017 23:59:59' "
if f_nature="-1" then 
	txtsql=txtsql & "AND nature<>'FACTUREC' AND nature<>'CHEQUE' AND nature<>'ACCORD PART' "
else
	txtsql=txtsql & "AND nature='" & f_nature & "' "
end if
if f_societe<>"-1" then txtsql=txtsql & "AND societe='" & f_societe & "' "
txtsql=txtsql & "ORDER BY cle"
set listecour = Server.CreateObject("ADODB.Recordset")
listecour.ActiveConnection = dsnIVOO
listecour.Source = txtsql
listecour.Open()
n=0

' Liste des nature de pièce
txtsql="SELECT nature_piece FROM courrier_profils_distribution GROUP BY nature_piece ORDER BY nature_piece"
set listepiece = Server.CreateObject("ADODB.Recordset")
listepiece.ActiveConnection = dsnivoo
listepiece.Source = txtsql
listepiece.Open()

%>
<html>
<head>
<title>Comptabilité</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="Styles/gboutons.css" type="text/css">
<script src="scripts/pr_calendrier.js" language="javascript" type="text/javascript"></script>
<script src="scripts/fctgene.js" language="javascript" type="text/javascript"></script>
<script language="JavaScript">
<!--

function change_filtre_societe(s){
	location.href="compta_prev_courrier.asp?f_societe="+s;
}

function change_filtre_nature(n){
	location.href="compta_prev_courrier.asp?f_nature="+n;
}

function affiche_onglet(o){
	switch(o){
		case 1:
			document.getElementById("onglet1").style.backgroundColor ="<%=couleurfondcase%>";
			document.getElementById("lentete").style.display="inline";
			document.getElementById("lliste").style.display="inline";
			document.getElementById("onglet2").style.backgroundColor ="#CCCCCC";
			document.getElementById("lentetet").style.display="none";
			document.getElementById("llistet").style.display="none";
			document.getElementById("onglet3").style.backgroundColor ="#CCCCCC";
			document.getElementById("lentetea").style.display="none";
			document.getElementById("llistea").style.display="none";
		break;
		case 2:
			document.getElementById("onglet1").style.backgroundColor ="#CCCCCC";
			document.getElementById("lentete").style.display="none";
			document.getElementById("lliste").style.display="none";
			document.getElementById("onglet2").style.backgroundColor ="<%=couleurfondcase%>";
			document.getElementById("lentetet").style.display="inline";
			document.getElementById("llistet").style.display="inline";
			document.getElementById("onglet3").style.backgroundColor ="#CCCCCC";
			document.getElementById("lentetea").style.display="none";
			document.getElementById("llistea").style.display="none";
		break;
		case 3:
			document.getElementById("onglet1").style.backgroundColor ="#CCCCCC";
			document.getElementById("lentete").style.display="none";
			document.getElementById("lliste").style.display="none";
			document.getElementById("onglet2").style.backgroundColor ="#CCCCCC";
			document.getElementById("lentetet").style.display="none";
			document.getElementById("llistet").style.display="none";
			document.getElementById("onglet3").style.backgroundColor ="<%=couleurfondcase%>";
			document.getElementById("lentetea").style.display="inline";
			document.getElementById("llistea").style.display="inline";
		break;
	}
}

function modif(c,n){
	switch(n){
		case "RELANCE REÇUE":
			location.href="treso_courrier_consult_relance0.asp?cle_courrier="+c;
			break;
		case "RELANCE EMISE":
			location.href="treso_courrier_consult_relance0.asp?cle_courrier="+c;
			break;

		case "COURRIER":
		case "RELEVE BANCAIRE":
			location.href="cour_gestion_mescour0.asp?pageretour=compta_prev_courrier.asp&cle_courrier="+c;
			break;
		default:
			location.href="treso_courrier_consult0.asp?cle_courrier="+c;
			break;
	}
}

function classe(c){
	location.href="cour_classer0.asp?pageretour=compta_prev_courrier.asp&cle_courrier="+c;
}

function surligne(self) {
	self.oldbgcolor=self.style.backgroundColor;
	self.style.backgroundColor="#cccccc";
}

function desurligne(self) {
	self.style.backgroundColor=self.oldbgcolor;
}

//-->
</script>
</head>
<body>
<script type="text/javascript" src="./scripts/toolstip.js"></script> 
<script type="text/javascript" src="./scripts/balloon.js"></script> 

<div id="ltitrepage" style="text-align:center; position:absolute; width:100%; height:28px; z-index:1; left:0px; top:0px"> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr> 
			<td width="10%" align="left"><img src="images/ivoo-logo.jpg" width="123" height="47" onClick="location.href='menugeneral.asp'" style="cursor: pointer;"></td>
			<td width="82%" bgcolor="<%=session("couleursite")%>" align="center"><span class="titrepage"><b><%=nomappli%></b> | TRESORERIE | COURRIER DEPENSE</span></td>
			<td width="8%" align="right"> <input type="button" name="baide" value="Aide" class="baide" onClick="ouvreaide()"></td>
		</tr>
	</table>
	<hr align="center">
</div>



<div id="lentete" style="position:absolute; width:1220; height:25; z-index:2; left:50px; top:140px"> 
  <table width="1200" border="0" cellspacing="0" cellpadding="0">
    <tr bgcolor="#FFFFFF">
		  <td colspan="8" align="center"><font face="Arial, Helvetica, sans-serif" color="#000000">&nbsp;<%=message%></font></td>
		</tr>
		<tr bgcolor="<%=couleurfondcase%>">
		  <td width="4%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Cl&eacute;</font></b></td>
      <td width="14%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Date r&eacute;ception</font></b></td>
      <td width="20%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Emetteur</font></b></td>
      <td width="12%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Destinataire</font></b></td>
      <td width="15%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Pi&egrave;ce</font></b></td>
      <td width="7%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Action</font></b></td>
      <td width="28%"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Commentaire</font></b></td>
    </tr>
  </table>
</div>
<div id="lliste" style="position:absolute; width:1220; height:400; z-index:1; left:50px; top:180px; overflow:auto; background-color: #FFFFCC; layer-background-color: #FFFFCC; border: 1px none #000000"> 
  <table width="1200" border="0" cellspacing="0" cellpadding="0">
	  <%while not listecour.eof : n=n+1%>
			<tr bgcolor="#FFFFCC" valign="top" onClick="modif(<%=listecour("cle")%>,'<%=listecour("nature")%>')" style="cursor:pointer" onMouseOver="surligne(this)" onMouseOut="desurligne(this)">
				<td width="4%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=listecour("cle")%></font></td>
				<td width="14%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=listecour("dh_saisie")%></font></td>
				<td width="20%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=listecour("societe_emettrice")%></font></td>
				<td width="12%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=left(listecour("societe"),10)%></font></td>
				<td width="15%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=listecour("nature")%></font></td>
				<td width="7%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=listecour("action")%></font></td>
				<td width="28%"><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=pointsus(listecour("commentaire"),45) & ppp%></font></td>
			</tr>
	  <%listecour.movenext:wend%>
  </table>
</div>


<div id="lfiltre" style="text-align:left; position:absolute; width:1220; height:25; z-index:2; left:50px; top:80px"> 
  <table width="1200" border="0" cellspacing="0" cellpadding="0">
    <tr bgcolor="<%=couleurfondcase%>">
		  <td colspan="6" bgcolor="<%=couleurfondcase%>" align="center"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF">Filtre courrier</font></b></td>
    </tr>
    <tr bgcolor="<%=couleurfondcase%>">
		  <td width="17%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Société :&nbsp;</font></b></td>
		  <td width="17%">
        <select name="societe" onchange="change_filtre_societe(this.value)">
          <option value="-1" <%=valsel("-1",f_societe)%>>Toutes</option>
					<%while not listefsoc.eof%>
						<option value="<%=trim(listefsoc("societe"))%>" <%=valsel(trim(listefsoc("societe")),f_societe)%>><%=trim(listefsoc("societe")) & " - " & listefsoc("n")%></option>
					<%listefsoc.movenext : wend%>
        </select>
			</td>
		  <td width="17%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Nature :&nbsp;</font></b></td>
		  <td width="17%">
				<select name="nature" onchange="change_filtre_nature(this.value)">
					<option value="-1" selected>Toutes</option>
					<%while not listepiece.eof%>
						<option value="<%=trim(listepiece("nature_piece"))%>" <%=valsel(trim(listepiece("nature_piece")),trim(f_nature))%>><%=trim(listepiece("nature_piece"))%></option>
					<%listepiece.movenext : wend%>
				</select>
			</td>
		  <td width="17%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Clé courrier :&nbsp;</font></b></td>
		  <td width="15%"><input type="text" name="cle_courrier_r" size="10" maxlength="10">&nbsp;&nbsp;<input type="button" name="btnvalcc" value="&nbsp;&nbsp;Ok&nbsp;&nbsp;" onclick="modif(document.getElementById('cle_courrier_r').value)"></td>
    </tr>
  </table>
</div>



<div id="lpied" style="position:absolute; width:1220; height:25; z-index:2; left:50px; top:640px"> 
  <table width="1200" border="0" cellspacing="0" cellpadding="0">
		<tr bgcolor="#FFFFFF">
      <td width="25%">&nbsp;<font face="arial" color="#000000"><%=n & " courrier" & singulierpluriel(n)%></font></td>
      <td width="25%">&nbsp;</td>
      <td width="25%">&nbsp;</td>
      <td width="25%" align="right"><input type="button" name="btnretour" value="Retour" onclick="location.href='tresor_menu.asp'" class="bretour"></td>
    </tr>
  </table>
</div>




</body>
</html>
<%
listefsoc.Close()
listecour.Close()
listepiece.Close()
%>
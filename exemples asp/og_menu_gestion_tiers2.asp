<%@LANGUAGE="VBSCRIPT" %> 
<!--#include file="fctgene.asp" -->
<%
' vérification de la session
if trim(session("identifiant"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=Délai de connection expiré, merci de vous ré-identifier..." 
	response.redirect(txtpageerreur)
end if

' Données reçues
pageretour=trim(request.querystring("pageretour")) : if pageretour="" then pageretour="soc_menu.asp"
tri=trim(request.querystring("tri"))
coder=trim(request.querystring("coder"))
societer=trim(request.querystring("societer"))
rubriquer=trim(request.querystring("rubriquer"))
statutr=trim(request.querystring("statutr"))

' Traitement tri
if tri="" then ' tri demandé non
	if trim(session(oggt_tri))="" then ' tri existant non
		tri="code desc"
	else ' tri existant oui
		tri=trim(session(oggt_tri))
	end if ' tri existant
else ' tri demandé oui
	session("oggt_tri")=tri
end if ' tri demandé

' Traitement filtre
txtwhere=""
if coder<>"" then txtwhere=txtwhere & "AND code=" & coder & " "
if societer<>"" then  txtwhere=txtwhere & "AND societe LIKE '%" & societer & "%' "
if rubriquer<>"" then  txtwhere=txtwhere & "AND rubrique_tresorerie='" & rubriquer & "' "
select case statutr
	case "VALIDE"
		txtwhere=txtwhere & "AND statut='VALIDE' "
	case "CREE"
		txtwhere=txtwhere & "AND statut='CREE' "
end select
		

' Liste
txtsql="SELECT code,societe,forme_juridique,statut,activite,no_compte_tiers,interco,rubrique_tresorerie FROM fournisseurs WHERE actif=1 "
if txtwhere<>"" then txtsql=txtsql & txtwhere
txtsql=txtsql & "ORDER BY " & tri
txtsqlliste=txtsql
set liste = Server.CreateObject("ADODB.Recordset")
liste.ActiveConnection = dsnpartenaires
liste.Source = txtsql
liste.Open()
n=0

' Liste des rubriques
txtsql="SELECT rubrique_tresorerie FROM fournisseurs WHERE actif=1 AND statut IN ('CREE','VALIDE') GROUP BY rubrique_tresorerie ORDER BY rubrique_tresorerie"
set listerub = Server.CreateObject("ADODB.Recordset")
listerub.ActiveConnection = dsnpartenaires
listerub.Source = txtsql
listerub.Open()

' Fonctions
function colorligne(s)
	' Colre la ligne en fonction du statut noir pour CREE, vert pour VALIDE
	if s="VALIDE" then colorligne="#009900" else colorligne="#000000"
end function
%>
<html>
<head>
<title>Tiers &agrave; valider</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="Styles/gboutons.css" type="text/css">
<script language="JavaScript">
<!--

function tri(t){
	location.href="og_menu_gestion_tiers2.asp?tri="+t;
}

function filtrer(){ 
	location.href="og_menu_gestion_tiers2.asp?coder="+document.getElementById("coder").value+"&societer="+document.getElementById("societer").value+"&rubriquer="+document.getElementById("rubriquer").value+"&statutr="+document.getElementById("statutr").value;
}

function defiltrer(){
	location.href="og_menu_gestion_tiers2.asp?coder=&societer=&rubriquer=&statutr=";
}

function modif(c){
	location.href="og_gestion_tiers_modifier_utilitaire0.asp?code="+c;
}

function surligne(self) {
	self.oldbgcolor=self.style.backgroundColor;
	self.style.backgroundColor="#cccccc";
}

function desurligne(self) {
	self.style.backgroundColor=self.oldbgcolor;
}

function ouvreaide(){
	window.open("aide.asp?sujet=aide_grh_role","","top=10,left=10,height=740,width=980,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no,resizable");
}

// -->
</script>
</head>
<body link="#FFFFFF" vlink="#FFFFFF" alink="#FFFFFF">
<div id="ltitrepage" style="position:absolute; width:100%; height:10px; z-index:1; left: 0; top: 0"> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr valign="middle"> 
			<td width="10%" align="left"><img src="images/ivoo-logo.jpg" width="123" height="47" style="cursor: pointer;" onClick="location.href='menugeneral.asp'"></td>
			<td width="83%" bgcolor="<%=session("couleursite")%>" align="center"><span class="titrepage"><b><%=nomappli%></b> | ... | ORGANISATION GENERALE | GESTION COMPTES TIERS</span></td>
			<td width="7%" align="right"><input type="button" name="baide" value="Aide" class="baide" onClick="ouvreaide()"></td>
		</tr>
	</table>
	<hr align="center">
</div>


<div id="lentete" style="position:absolute; width:1200; height:20px; z-index:1; left:20; top:90"> 
	<table width="1200" border="0" cellspacing="0" cellpadding="0">
		<tr style="font-family:arial; font-size:100%; font-weight:bold; color:white; background-color:#000099"> 
			<td width="7%"><a href="#" onclick="tri('code')"><%=trip%></a>Code<a href="#" onclick="tri('code desc')"><%=triq%></a></td>
      <td width="15%"><a href="#" onclick="tri('societe')"><%=trip%></a>Soci&eacute;t&eacute;<a href="#" onclick="tri('societe desc')"><%=triq%></a></td>
      <td width="7%">Forme</td>
      <td width="38%">Activité</td>
      <td width="8%">N° compte</td>
      <td width="5%">Interco</td>
      <td width="20%"><a href="#" onclick="tri('rubrique_tresorerie')"><%=trip%></a>Rub. trésorerie<a href="#" onclick="tri('societe desc')"><%=triq%></a></td>
    </tr>
	</table>
</div>


<div id="lfiltre" style="position:absolute; width:1200; height:20px; z-index:1; left:20; top:65"> 
	<table width="1200" border="0" cellspacing="0" cellpadding="0">
		<tr style="font-family:arial; font-size:100%; font-weight:bold; color:white; background-color:#000099"> 
			<td width="8%" align="right">Code :&nbsp;</td>
      <td width="8%" bgcolor="#FFFFCC"><input type="text" id="coder"name="coder" value="<%=coder%>" size="10" maxlength="10"></td>
      <td width="8%" align="right">Société :&nbsp;</td>
      <td width="20%" bgcolor="#FFFFCC"><input type="text" id="societer" name="societer" value="<%=societer%>"></td>
      <td width="10%" align="right">Rubrique :&nbsp;</td>
      <td width="19%" bgcolor="#FFFFCC">
				<select name="rubriquer" id="rubriquer">
  	  		<option value="" selected>Choisir</option>
					<%while not listerub.eof%>
						<option value="<%=listerub("rubrique_tresorerie")%>" <%=valsel(trim(listerub("rubrique_tresorerie")),rubriquer)%>><%=listerub("rubrique_tresorerie")%></option>
					<%listerub.movenext : wend%>
	  		</select>
			</td>
			<td width="8%" align="right">Validé :&nbsp;</td>
      <td width="8%" bgcolor="#FFFFCC">
				<select name="statutr" id="statutr">
  	  		<option value="" selected>Tous</option>
					<option value="CREE" <%=valsel("CREE",statutr)%>>Non</option>
					<option value="VALIDE" <%=valsel("VALIDE",statutr)%>>Oui</option>
	  		</select>
			</td>
      <td width="11%" bgcolor="#FFFFCC"><input type="button"  id="btnfiltrer"  name="btnfiltrer" value="Filtrer" onclick="filtrer()">&nbsp;&nbsp;<input type="button" name="btndefiltrer" value="Défiltrer" onclick="defiltrer()"></td>
    </tr>
	</table>
</div>


<div id="llegende" style="position:absolute; width:1200; height:20px; z-index:1; left:1260; top:65"> 
	<table>
		<tr>
			<td width="50%" bgcolor="#FFFFFF" align="center"><b><font face="arial" color="#000000">Légende</font></b></td>
		</tr>
		<tr>
			<td width="50%" bgcolor="#FFFFCC" align="center"><font face="arial" color="#000000">Non validés</font></td>
		</tr>
		<tr>
			<td width="50%" bgcolor="#FFFFCC" align="center"><font face="arial" color="#009900">Validés</font></td>
		</tr>
	</table>	
</div>


<div id="lliste" style="position:absolute; width:1220; height:580px; z-index:1; left:20; top:110; overflow:auto; background-color: #FFFFCC; layer-background-color: #FFFFCC; border: 1px none #000000"> 
	<table width="1200" border="0" cellspacing="0" cellpadding="0">
		<%while not liste.eof%>
		<tr onClick="modif(<%=liste("code")%>)" onMouseOver="surligne(this)" onMouseOut="desurligne(this)" style="font-family:arial; font-size:80%; font-weight:normal; color:<%=colorligne(liste("statut"))%>; background-color:#FFFFCC; cursor:pointer"> 
			<td width="7%" align="right"><%=liste("code")%>&nbsp;&nbsp;&nbsp;</td>
      <td width="15%"><%=liste("societe")%></td>
      <td width="7%"><%=liste("forme_juridique")%></td>
      <td width="38%"><%=liste("activite")%></td>
      <td width="8%"><%=liste("no_compte_tiers")%></td>
      <td width="5%"><%=ouinon(liste("interco"))%></td>
      <td width="20%"><%=liste("rubrique_tresorerie")%></td>
    </tr>
		<%n=n+1 : liste.movenext : wend%>
	</table>
</div>


<div id="lpied" style="position:absolute; width:1200; height:20px; z-index:1; left:20; top:700"> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr> 
			<td width="20%"><input type="button" name="btnajouter" value="Nouveau" onclick="location.href='og_gestion_tiers_ajouter0.asp?pageretour=og_menu_gestion_tiers2.asp'" class="bmenu"></td>
			<td width="60%"><font face="arial"><%=n & " fournisseur" & singulierpluriel(n) & " affiché" & singulierpluriel(n)%></font></td>
			<td width="20%" align="right"><input type="button" name="btnretour" value="Retour" onclick="location.href='<%=pageretour%>'" class="bretour"></td>
		</tr>
	</table>
</div>


</body>
</html>
<%
liste.Close()
listerub.Close()
%>

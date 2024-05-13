<%@LANGUAGE="VBSCRIPT" %> 
<!--#include file="fctgene.asp" -->
<!--#include file="fctgene_courrier.asp" -->
<%
' vérification de la session
if trim(session("identifiant"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=Délai de connection expiré, merci de vous ré-identifier..." 
	response.redirect(txtpageerreur)
end if
session("cour_util")="TRESORERIE"

' Données reçues
type_prevision=trim(request.querystring("type_prevision"))
cle_courrier=trim(request.querystring("cle_courrier")) : if cle_courrier="" or cle_courrier="0" or isnull(cle_courrier) or not isnumeric(cle_courrier) then cle_courrier="0" ' clé du courrier (n'existe pas forcément, la prévision peut ne pas être encore associée à un courrier).
cle_rubrique=trim(request.querystring("cle_rubrique"))
if cle_rubrique<>"-1" and cle_rubrique<>"" then 
	rub=split(cle_rubrique,"|")
	cle_rubrique=rub(0)
else
	cle_rubrique="0"
end if

' Lecture data courrier
txtsql="SELECT societe,code_fournisseur_societe_destinataire,societe_emettrice,code_fournisseur_societe_emettrice,cle_prevision,nature,action,nom_fichier,commentaire,date_piece,sens FROM courrier WHERE cle=" & cle_courrier
set data = Server.CreateObject("ADODB.Recordset")
data.ActiveConnection = dsnIVOO
data.Source = txtsql
data.Open()
cle_prevision=data("cle_prevision")
if cle_prevision<>0 then ' courrier associé oui
	data.close()
	response.redirect("compta_prev_courrier.asp?message=Le courrier " & cle_courrier & " est déjà associé à la prévision " & cle_previson & "...")
end if ' courrier associé ?
sens=trim(data("sens"))
code_fournisseur_societe_emettrice=data("code_fournisseur_societe_emettrice")
societe_emettrice=data("societe_emettrice")
code_fournisseur_societe_destinataire=data("code_fournisseur_societe_destinataire")
societe_destinataire=data("societe")
action=ucase(trim(data("action")))
nature=ucase(trim(data("nature")))
commentaire=data("commentaire")
nom_fichier=data("nom_fichier") : if nom_fichier="" or isnull(nom_fichier) then nom_fichier="pdf_courrier_non_trouve.pdf"
nom_fichier_courrier_aff=left(nom_fichier,len(nom_fichier)-4)
date_piece=data("date_piece") : if isdate(date_piece) then date_piece=formatdatetime(date_piece)
data.Close()

' Recherche de la rubrique tiers
txtsql="SELECT cle_rubrique_tresorerie, mode_paiement FROM fournisseurs WHERE code=" & code_fournisseur_societe_destinataire
set rubtiers = Server.CreateObject("ADODB.Recordset")
rubtiers.ActiveConnection = dsnpartenaires
rubtiers.Source = txtsql
rubtiers.Open()
if not rubtiers.eof then ' tiers trouvé oui
	if cle_rubrique="0" then cle_rubrique=trim(rubtiers("cle_rubrique_tresorerie"))
	mode_paiement=ucase(trim(rubtiers("mode_paiement")))
end if' tiers trouvé ?
rubtiers.Close()

' Y a t'il déjà une prévision ou plusieurs non soldée sur ce tiers
txtsql="SELECT TOP 1 cle FROM previsions "
txtsql=txtsql & "WHERE ref_source_tiers=" & code_fournisseur_societe_destinataire & " "
'txtsql=txtsql & "AND (statut='A VALIDER' OR statut='VALIDE' OR statut='ORDO') "
set prevtiers = Server.CreateObject("ADODB.Recordset")
prevtiers.ActiveConnection = dsncompta
prevtiers.Source = txtsql
prevtiers.Open()
if not prevtiers.eof then 
	btnvisuprev="<input type=""button"" value=""Prév"" id=""btnvisuprev"" onclick=""visuprev()"" style=""display:inline"" onMouseOver=""Tip('Visualiser les prévisions en cours sur le tiers sélectionné\r et, éventuellement, en choisir une plutôt que de créer une nouvelle prévison', BALLOON, true, ABOVE, true)"" onMouseOut=""UnTip()"">"
else 
	btnvisuprev="<input type=""button"" value=""Prév"" id=""btnvisuprev"" onclick=""visuprev()"" style=""display:inline"" onMouseOver=""Tip('Il n\'existe aucune prévision pour ce tiers', BALLOON, true, ABOVE, true)"" onMouseOut=""UnTip()"">"
end if
prevtiers.Close()

' Traitement de la liste des sociétés (=destinataire)
txtsqlsocietes="SELECT code,iif(societe_code_compta is null or societe_code_compta='',societe,societe_code_compta) as societe,rubrique_tresorerie FROM fournisseurs WHERE actif=1 AND societe_code_compta<>'' ORDER BY iif(societe_code_compta is null or societe_code_compta='',societe,societe_code_compta)"
txtsqlfournisseurs="SELECT code, societe, rubrique_tresorerie FROM fournisseurs WHERE (actif=1 AND societe<>'NC') ORDER BY societe"
select case sens
	case "S" ' courrier sortant
		txtsql=txtsqlfournisseurs ' les sociétés sont l'émetteur
	case "E" ' courrier entrant
		txtsql=txtsqlsocietes ' les fournisseurs sont le éémetteur
	case "I" ' courrier interne
		txtsql=txtsqlsocietes ' les sociétés sont l'émetteur
end select ' courrier sortant ?
' Liste sociétés
set listesoc = Server.CreateObject("ADODB.Recordset")
listesoc.ActiveConnection = dsnpartenaires
listesoc.Source = txtsql
listesoc.Open()

' Liste des rubriques
if sens<>"E" then code_filtre_rubrique=code_fournisseur_societe_destinataire else code_filtre_rubrique=code_fournisseur_societe_emettrice
txtsql="SELECT cle_rubrique AS cle, libelle "
txtsql=txtsql & "FROM fournisseurs_rubriques AS f JOIN " & nom_base_compta & ".dbo.rubriques_previsions_tresorerie AS r ON f.cle_rubrique=r.cle "
txtsql=txtsql & "WHERE code_fournisseur=" & code_filtre_rubrique
set listerub = Server.CreateObject("ADODB.Recordset")
listerub.ActiveConnection = dsnpartenaires
listerub.Source = txtsql
listerub.Open()

' Lecture des préfixes de rubriques
txtsql="SELECT prefixe_libelle FROM prefixes_libelles_rubriques "
txtsql=txtsql & "WHERE cle_rubrique IN (SELECT cle_rubrique FROM " & nom_base_partenaires & ".dbo.fournisseurs_rubriques WHERE code_fournisseur=" & code_filtre_rubrique & ") "
if cle_rubrique<>"0" then txtsql=txtsql & "AND cle_rubrique=" & cle_rubrique & " "
txtsql=txtsql & "ORDER BY prefixe_libelle"
set listeprefix = Server.CreateObject("ADODB.Recordset")
listeprefix.ActiveConnection = dsncompta
listeprefix.Source = txtsql
listeprefix.Open()

' Liste des comptes banque
if sens<>"E" then emetteur=societe_emettrice else emetteur=societe_destinataire
if trim(emetteur)="" then ' societe connue non
	txtsql="SELECT no_compte,nom_banque FROM banques_comptes_societes WHERE actif=1 ORDER BY nom_banque"
else ' societe connue oui
	txtsql="SELECT no_compte,nom_banque FROM banques_comptes_societes WHERE code_compta_societe='" & emetteur & "' AND actif=1 ORDER BY nom_banque"
end if ' societe connue ?
set listebank = Server.CreateObject("ADODB.Recordset")
listebank.ActiveConnection = dsnpartenaires
listebank.Source = txtsql
listebank.Open()


' Années
a=cint(right(year(date),2))
a0=a-2
a1=a-1
a2=a
a3=a+1
a4=a+2

%>
<html>
<head>
<title>Nouvelle pr&eacute;vision</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="Styles/gboutons.css" type="text/css">
<script src="scripts/pr_calendrier.js" language="javascript" type="text/javascript"></script>
<script src="scripts/fctgene.js" language="javascript" type="text/javascript"></script>
<script language="JavaScript">
<!--

function verif(f){
	if(f.type_prevision.value==""){
		alert("Veuillez indiquer le type de prévision à saisir SVP !");
		f.type_prevision.focus();
		return false;
	}
	if(f.date_piece.value==""){
		alert("Veuillez saisir la date de pièce SVP !");
		f.date_piece.focus();
		return false;
	}else{
		if(dateOk(f.date_piece.value,"date pièce")==0){
			f.date_piece.focus();
			return false;
		}
	}
	if(f.societe.value=="-1"){
		alert("Veuillez saisir la société concernée !");
		f.societe.focus();
		return false;
	}
	if(f.tiers.value=="-1"){
		alert("Veuillez saisir le tiers !");
		f.tiers.focus();
		return false;
	}
	if(f.libelle1.value=="-1"){
		alert("Veuillez saisir le préfixe du libellé !");
		f.libelle1.focus();
		return false;
	}
	if(f.libelle2.value=="-1"){
		alert("Veuillez saisir le mois du libellé !");
		f.libelle2.focus();
		return false;
	}
	if(f.libelle3.value=="-1"){
		alert("Veuillez saisir l'année du libellé !");
		f.libelle3.focus();
		return false;
	}
	if(f.libelle4.value=="-1"){
		alert("Veuillez saisir le trimestre du libellé !");
		f.libelle4.focus();
		return false;
	}
	if(f.beneficiaire.value==""){
		alert("Veuillez saisir le libellé complet !");
		f.beneficiaire.focus();
		return false;
	}
	if(f.montant.value==""){
		alert("Veuillez saisir un montant !");
		f.montant.focus();
		return false;
	}else{
		if(isNaN(remplace_virgule_par_point(f.montant.value))){
			alert("Veuillez saisir un montant numérique (avec. comme séparateur décimal) !");
			f.montant.focus();
			return false;
		}
	}
	if(f.avectva.checked){
		if(f.montant_tva1.value+f.montant_tva2.value+f.montant_tva3.value+f.montant_tva4.value==""){
			alert("Veuillez saisir au moins un des montants de TVA\n(ou décochez la case \"avec TVA\" s'il n'y a pas de TVA)");
			f.montant_tva1.focus();
			return false;
		}else{
			if(f.montant_tva1.value!=""){
				if(isNaN(remplace_virgule_par_point(f.montant_tva1.value))){
					alert("Votre saisie du montant de la TVA <%=const_taux_tva1%> est incorrect !");
					f.montant_tva1.focus();
					return false;
				}
			}
			if(f.montant_tva2.value!=""){
				if(isNaN(remplace_virgule_par_point(f.montant_tva2.value))){
					alert("Votre saisie du montant de la TVA <%=const_taux_tva2%> est incorrecte !");
					f.montant_tva2.focus();
					return false;
				}
			}
			if(f.montant_tva3.value!=""){
				if(isNaN(remplace_virgule_par_point(f.montant_tva3.value))){
					alert("Votre saisie du montant de la TVA <%=const_taux_tva3%> est incorrecte !");
					f.montant_tva3.focus();
					return false;
				}
			}
			if(f.montant_tva4.value!=""){
				if(isNaN(remplace_virgule_par_point(f.montant_tva4.value))){
					alert("Votre saisie du montant de la TVA <%=const_taux_tva4%> est incorrect !");
					f.montant_tva4.focus();
					return false;
				}
			}
		}
	}
	if(f.date_echeance.value==""){
		alert("Veuillez saisir la date d'échéance !");
		f.date_echeance.focus();
		return false;
	}else{
		if(dateOk(f.date_echeance.value,"date échéance")==0){
			f.date_echeance.focus();
			return false;
		}else{
			de=dateJava(f.date_echeance.value);
			dj=dateJava("<%=date%>");
			if((de<dj)&&(f.type_prevision.value=="P")){
				alert("La date d'échéance est dépassée !");
				f.date_echeance.focus();
				return false;
			}
		}
	}
	
	if((f.mode_paiement.value=="NC")||(f.mode_paiement.value=="")||(f.mode_paiement.value=="NA")){
		alert("Le mode de règlement du tiers n'est pas défini !\nVeuillez éditer le tiers pour saisir son mode de règlement SVP.");
		f.mode_paiement.focus();
		return false;
	}
	return true;
}

function change_societe(s){
	// Affiche le bouton [ Associer courrier ] si pas de clé courrier connue et société facturante connue
	if((s!="-1")&&("<%=cle_courrier%>"=="0")){
		document.getElementById("btn_assoc_cour").style.display="inline";
	}else{
		document.getElementById("btn_assoc_cour").style.display="none";
	}
}

function modifiertiers(){
	txturl="og_gestion_tiers_modifier0.asp?code=<%=code_fournisseur_societe_destinataire%>&pageamodifier=1&champamodifier=mode_paiement";
	param="top=10,left=10,height=740,width=1100,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no";
	window.open(txturl,"",param);
}

function changerubrique(r){
	location.href="treso_courrier_consult0.asp?cle_courrier=<%=cle_courrier%>&code_fournisseur_societe_destinataire="+document.getElementById("tiers").value+"&pageretour=compta_prev_courrier.asp&soccour="+document.getElementById("societe").value+"&cle_rubrique="+r+"&type_prevision="+document.getElementById("type_prevision").value;
}

function visuprev(){
	url="treso_visu_prev_tiers.asp?code="+document.getElementById("tiers").value+"&cle_courrier=<%=cle_courrier%>";
	param="top=10,left=10,height=740,width=980,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no";
	window.open(url,"",param);
}

function associer_courrier(){
	param="top=20,left=20,height=768,width=1024,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no,resizable";
	url="compta_prev_assoc_cour0.asp?cle_prevision=0";
	window.open(url,"",param);
}

function modifpiece(){
	location.href="cour_gestion_mescour0.asp?cle_courrier=<%=cle_courrier%>&pageretour=compta_prev_courrier.asp";
}

function saisiebenef(){
	if((document.getElementById("tiers").value=="1052")||(document.getElementById("tiers").value=="995")){ // cas particulier du tiers salariés internes (1052 en prod, 995 en test)
		txturl="treso_liste_salaries.asp";
		txtparam="top=10,left=10,height=740,width=900,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no";
		window.open(txturl,"",txtparam)
	}
}

function avecsanstva(obj){
	if((obj.checked)){
		document.getElementById("montant_tva1").value="";
		document.getElementById("montant_tva2").value="";
		document.getElementById("montant_tva3").value="";
		document.getElementById("montant_tva4").value="";
		document.getElementById("tva1").style.display = 'initial';
		document.getElementById("tva2").style.display = 'initial';
		document.getElementById("tva3").style.display = 'initial';
		document.getElementById("tva4").style.display = 'initial';
		document.getElementById("tva20cb").style.display = 'initial';
	}else{
		document.getElementById("montant_tva1").value=0;
		document.getElementById("montant_tva2").value=0;
		document.getElementById("montant_tva3").value=0;
		document.getElementById("montant_tva4").value=0;
		document.getElementById("tva1").style.display = 'none';
		document.getElementById("tva2").style.display = 'none';
		document.getElementById("tva3").style.display = 'none';
		document.getElementById("tva4").style.display = 'none';
		document.getElementById("tva20cb").style.display = 'none';
	}
	 tva20plus(document.getElementById("tva20"));
}


function tva20plus(obj){
	if((obj.checked)){
		document.getElementById("tva1").style.display = 'initial';
		document.getElementById("tva2").style.display = 'initial';
		document.getElementById("tva3").style.display = 'initial';
	}else{
		document.getElementById("montant_tva1").value=0;
		document.getElementById("montant_tva2").value=0;
		document.getElementById("montant_tva3").value=0;
		document.getElementById("tva1").style.display = 'none';
		document.getElementById("tva2").style.display = 'none';
		document.getElementById("tva3").style.display = 'none';
	}
}








function ouvreaide(){
	window.open("aide.asp?sujet=aide_gestionfacturation_role","","top=10,left=10,height=740,width=980,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no,resizable");
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
			<td width="10%" height="19" align="left"><img src="images/ivoo-logo.jpg" width="123" height="47" style="cursor:pointer;" onclick="location.href='menugeneral.asp'"></td>
			<td width="82%" height="19" bgcolor="<%=session("couleursite")%>" align="center"><span class="titrepage"><b><%=nomappli%></b>  | ... | NOUVELLE PREVISION DE DEPENSE <b><%=soccour%></b>&nbsp;<%if cle_courrier<>"0" then response.write(" | COURRIER " & cle_courrier)%></span></td>
			<td width="8%" height="19" align="right"><input type="button" name="baide" value="Aide" class="baide" onClick="ouvreaide()"></td>
		</tr>
	</table>
	<hr align="center">
</div>



<div id="linfo" style="text-align:center; position:absolute; width:750; height:40px; z-index:1; left:0px; top:60px; display:inline">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr align="center" bgcolor="<%=couleurfondcase%>">
			<td colspan="9"><font face="Arial, Helvetica, sans-serif" size="4" color="#FFFFFF"><b>COURRIER <%=nom_fichier_courrier_aff%></b></font></td>
    </tr>
		<tr align="center">
			<td>
		</tr>
		<tr>
			<td align="right" width="70" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">Société :&nbsp;</font></b></td>
      <td align="left" width="100" bgcolor="#FFFFCC"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">&nbsp;<%=soccour%></font></td>
      <td align="right" width="60" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">Nature :&nbsp;</font></b></td>
      <td align="left" width="100" bgcolor="#FFFFCC"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">&nbsp;<%=nature_courrier(nature)%></font></td>
      <td align="right" width="100" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">Action :&nbsp;</font></b></td>
      <td align="left" width="100" bgcolor="#FFFFCC"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">&nbsp;<%=action%></font></td>
      <td align="right" width="100" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">Commentaire :&nbsp;</font></b></td>
      <td align="left" width="220" bgcolor="#FFFFCC"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000"><%=left(commentaire,50)%></font></td>
      <td align="center" width="100"><input type="button" name="btnmodifpiece" id="btnmodifpiece" value="Modifier" onclick="modifpiece()">&nbsp;</td>
    </tr>
	</table>
</div>

<form name="saisie" id="saisie" method="post" action="treso_courrier_consult1.asp" onsubmit="return(verif(this))">
<input type="hidden" name="cle_courrier" id="cle_courrier" value="<%=cle_courrier%>">
<input type="hidden" name="mode_paiement" id="mode_paiement" value="<%=mode_paiement%>">
<%if sens="E" then void_tiers=code_fournisseur_societe_emettrice else void_tiers=code_fournisseur_societe_destinataire%>
<input type="hidden" name="tiers" id="tiers" value="<%=void_tiers%>">
<input type="hidden" name="type_prevision" id="type_prevision" value="P">
<div id="lsaisie" style="text-align:center; position:absolute; width:700px; height:400px; z-index:1; left:754px; top:120px;">
	<table width="100%" border="0" cellspacing="0" cellpadding="1">
		<tr>
			<td width="20%" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Date pièce :&nbsp;</font></b></td>
			<td width="80%" align="left" bgcolor="#FFFFCC">
				<input name="date_piece" type="text" id="date_piece" value="<%=date_piece%>" size="10" maxlength="10" onfocus="javascript:view_microcal(true,date_piece,microcal1,-1,0);" onblur="javascript:view_microcal(false,date_piece,microcal1,-1,0);">
				<div id="microcal1" style="visibility:hidden; position:absolute; border:2px black outset; background:#ffffff;"></div>
				&nbsp;&nbsp;&nbsp;<input type="button" name="btn_assoc_cour" value="Associer courrier" style="display:none" onclick="associer_courrier()">
			</td>
    </tr>
		<tr>
			<td width="20%" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Soci&eacute;t&eacute; :&nbsp;</font></b></td>
			<td width="80%" align="left" bgcolor="#FFFFCC">
				<select name="societe" id="societe">
  	  		<option value="-1" selected>Choisir</option>
					<%while not listesoc.eof
					 if sens="E" then%>
							<option value="<%=listesoc("code")%>" <%=valsel(trim(listesoc("code")),trim(code_fournisseur_societe_destinataire))%>><%=listesoc("societe")%></option>
						<%else%>
							<option value="<%=listesoc("code")%>" <%=valsel(trim(listesoc("code")),trim(code_fournisseur_societe_emettrice))%>><%=listesoc("societe")%></option>
						<%end if%>
					<%listesoc.movenext:wend%>
	  		</select>
			</td>
    </tr>
		<tr>
			<td width="20%" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Tiers :&nbsp;</font></b></td>
			<%if sens="E" then%>
				<td width="80%" align="left" bgcolor="#FFFFCC"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=code_fournisseur_societe_emettrice & " - " & societe_emettrice%></font></b>
			<%else%>
				<td width="80%" align="left" bgcolor="#FFFFCC"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#000000"><%=code_fournisseur_societe_destinataire & " - " & societe_destinataire%></font></b>
			<%end if%>
			&nbsp;
			<%=btnvisuprev%>&nbsp;
			<input type="button" value="Edit. tiers" name="btnmodiftiers" onclick="modifiertiers()" onMouseOver="Tip('Modifier le tiers', BALLOON, true, ABOVE, true)" onMouseOut="UnTip()">
			</td>
    </tr>
		<tr>
			<td width="20%" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Rubrique :&nbsp;</font></b></td>
			<td width="80%" align="left" bgcolor="#FFFFCC">
				<select name="rubrique" id="rubrique" onchange="changerubrique(this.value)">
  	  		<option value="-1" selected>Choisir</option>
					<%while not listerub.eof%>
						<option value="<%=listerub("cle") & "|" & listerub("libelle")%>" <%=valsel(trim(listerub("cle")),trim(cle_rubrique))%>><%=listerub("libelle")%></option>
					<%listerub.movenext : wend%>
	  		</select>
    </td>
    </tr>
		<tr>
			<td width="20%" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Libellé :&nbsp;</font></b></td>
			<td width="80%" align="left" bgcolor="#FFFFCC">
				<table width="400" border="5" >
					<tr>
						<td width="150"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">&nbsp;Préfixe libellé</font></td>
						<td width="65"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">Mois</font></td>
						<td width="65"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">&nbsp;Année</font></td>
						<td width="60"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">&nbsp;Trim</font></td>
						<td width="60"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">&nbsp;</font></td>
					</tr>
					<tr>
						<td width="150">
							<select name="libelle1" id="libelle1">
								<option value="-1" selected>Choisir</option>
								<%if listeprefix.eof then response.write("<option value=""" & trim(rubrique_tiers) & """>" & trim(rubrique_tiers) & "</option>")
								while not listeprefix.eof%>
									<option value="<%=listeprefix("prefixe_libelle")%>"><%=listeprefix("prefixe_libelle")%></option>
								<%listeprefix.movenext : wend%>
							</select>
						</td>
						<td width="65">
							<select name="libelle2" id="libelle2">
								<option value="-1" selected>Choisir</option>
								<%for m=1 to 12%>
									<option value="<%=sur2digits(m)%>"><%=sur2digits(m)%></option>
								<%next%>
							</select>
						</td>
						<td width="65">
							<select name="libelle3" id="libelle3">
								<option value="-1" selected>Choisir</option>
								<option value="<%=sur2digits(a0)%>">20<%=sur2digits(a0)%></option>
								<option value="<%=sur2digits(a1)%>">20<%=sur2digits(a1)%></option>
								<option value="<%=sur2digits(a2)%>">20<%=sur2digits(a2)%></option>
								<option value="<%=sur2digits(a3)%>">20<%=sur2digits(a3)%></option>
								<option value="<%=sur2digits(a4)%>">20<%=sur2digits(a4)%></option>
							</select>
						</td>
						<td width="60">
							<select name="libelle4" id="libelle4">
								<option value="-1" selected>Choisir</option>
								<option value="1">1er trimestre</option>
								<option value="2">2ème trimestre</option>
								<option value="3">3ème trimestre</option>
								<option value="4">4éme trimestre</option>
							</select>
						</td>
						<td width="60"><input name="beneficiaire" id="beneficiaire" type="text" size="15" maxlength="15" onclick="saisiebenef()"></td>
					</tr>
				</table>
			</td>
    </tr>
		<tr>
			<td width="20%" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Montant TTC :&nbsp;</font></b></td>
			<td width="80%" align="left" bgcolor="#FFFFCC"><input name="montant" id="montant" type="text" size="10" maxlength="10"></td>
    </tr>
		  <tr>
			  <td width="20%" bgcolor="<%=couleurfondcase%>" align="right"><b><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2">Banq. r&egrave;glement</font><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="2"> :&nbsp;</font></b></td>
        <td width="80%" bgcolor="#FFFFCC" align="left">
				  <select name="no_compte_banque" id="no_compte_banque" style="width:300px">
            <option value="-1" <%=valsel("",no_compte_banque)%>>Choisir</option>
					  <%while not listebank.eof%>
							<option value="<%=trim(listebank("no_compte"))%>" <%=valsel(trim(listebank("no_compte")),no_compte_banque)%>><%=trim(listebank("no_compte")) & " - " & trim(listebank("nom_banque"))%></option>
					  <%listebank.movenext : wend%>
          </select>
				</td>
      </tr>
		<tr>
			<td colspan="2" align="center" bgcolor="<%=couleurfondcase%>"><input type="checkbox" name="avectva" id="avectva" value="1" onclick="avecsanstva(this)" checked>
				<b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Avec TVA</font></b></td>
    </tr>
		 </table>
	  <table width="100%" border="0" cellspacing="0" cellpadding="1">
		<tr id="tva20cb">
			<td colspan="2"  width="700" align="center" bgcolor="<%=couleurfondcase%>"><input type="checkbox" id="tva20"  name="tva20" value="1" onclick="tva20plus(this)" <%=tva_20_plus%>>
				<b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">moins de 20% de TVA </font></b></td>
    </tr>
		<tr id="tva1" style="display:none;">
			<td width="140" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">TVA <%=const_taux_tva1%>% :&nbsp;</font></b></td>
			<td width="560" align="left" bgcolor="#FFFFCC"><input id="montant_tva1" name="montant_tva1" type="text" size="10" maxlength="10"></td>
    </tr>
		<tr id="tva2" style="display:none;">
			<td width="140" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">TVA <%=const_taux_tva2%>% :&nbsp;</font></b></td>
			<td width="560" align="left" bgcolor="#FFFFCC"><input id="montant_tva2" name="montant_tva2" type="text" size="10" maxlength="10"></td>
    </tr>
		<tr id="tva3" style="display:none;">
			<td width="140" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">TVA <%=const_taux_tva3%> % :&nbsp;</font></b></td>
			<td width="560" align="left" bgcolor="#FFFFCC"><input id="montant_tva3" name="montant_tva3" type="text" size="10" maxlength="10"></td>
    </tr>
		<tr id="tva4">
			<td width="140" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">TVA <%=const_taux_tva4%> % :&nbsp;</font></b></td>
			<td width="560" align="left" bgcolor="#FFFFCC"><input id="montant_tva4" name="montant_tva4" type="text" size="10" maxlength="10"></td>
    </tr>
		
	</table>
	<table width="100%" border="0" cellspacing="0" cellpadding="1">
		<tr>
			<td width="140" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Date échéance :&nbsp;</font></b></td>
			<td width="560" align="left" bgcolor="#FFFFCC">
				<input name="date_echeance" type="text" id="date_echeance" value="<%=date_echeance%>" size="10" maxlength="10" onfocus="javascript:view_microcal(true,date_echeance,microcal2,-1,0);" onblur="javascript:view_microcal(false,date_echeance,microcal2,-1,0);">
				<div id="microcal2" style="visibility:hidden; position:absolute; border:2px black outset; background:#ffffff;"></div>
			</td>
    </tr>
		<tr>
			<td width="140" align="right" bgcolor="<%=couleurfondcase%>"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">Date ordo :&nbsp;</font></b></td>
			<td width="560" align="left" bgcolor="#FFFFCC">
				<input name="date_ordo" type="text" id="date_ordo" value="<%=date_ordo%>" size="10" maxlength="10" onfocus="javascript:view_microcal(true,date_ordo,microcal3,-1,0);" onblur="javascript:view_microcal(false,date_ordo,microcal3,-1,0);">
				<div id="microcal3" style="visibility:hidden; position:absolute; border:2px black outset; background:#ffffff;"></div>
			</td>
    </tr>
    <tr>
      <td colspan="2" align="center"><input type="submit" name="btnok" id="btnok" value="Ok" class="bok">&nbsp;&nbsp;&nbsp;<input type="button" name="btnretour" id="btnretour" value="Annuler" onClick="location.href='compta_prev_courrier.asp'" class="bretour"></td>
    </tr>
	</table>
</div>
</form>


<div id="laffichage" style="text-align:center; position:absolute; width:750; height:635px; z-index:1; left:0px; top:105px; display:inline">
	<iframe src='courriers/<%=nom_fichier%>' width="750" height="635"></iframe>
</div>


</body>
</html>
<%
listesoc.Close()
listeprefix.Close()
listebank.Close()
%>
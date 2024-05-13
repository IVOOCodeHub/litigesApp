<%@LANGUAGE="VBSCRIPT" %> 
<!--#include file="fctgene.asp" -->
<%
' vérification de la session
if trim(session("identifiant"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=Délai de connection expiré, merci de vous ré-identifier..." 
	response.redirect(txtpageerreur)
end if

' initialisation
dim j(42),texteaffiche(42,5),couleurcase(42,5),couleurtexte(42,5),formesouris(42,5),javacase(42,5)

' données reçues
dmd=trim(request.querystring("datec"))
if dmd="" then ' date demandée non
	if session("gsp_datec")="" then ' date existante non
		datec=date
		session("gsp_datec")=date
	else ' date existante oui
		datec=session("gsp_datec")
	end if ' date existante ?
else ' date demandée oui
	datec=dmd
	session("gsp_datec")=dmd
	step=trim(request.querystring("step"))
end if ' date demandée ?

' Traitement de la demande
if step="p" then datec=dateadd("m",1,datec) ' mois suivant demandé
if step="m" then datec=dateadd("m",-1,datec) ' mois précédent demandé
session("gsp_datec")=datec
mois=month(datec)
annee=year(datec)

' Calcul du tableau j() des dates à afficher (on commence par le premier jour du mois et on le place dans la semaine)
date_premier_du_mois="01/" & sur2digits(mois) & "/" & annee
indice_debut=weekday(date_premier_du_mois)
j(indice_debut)=date_premier_du_mois

' compte à rebours des jours précédents le premier jour du mois
if indice_debut>1 then ' le premier du mois est un dimanche non  
	for i=indice_debut-1 to 1 step -1
		j(i)=dateadd("d",-1,j(i+1))
	next
end if ' le premier du mois est un dimanche ? 

' jours suivants le premier jour du mois
for i=indice_debut+1 to 42
	j(i)=dateadd("d",1,j(i-1))
next

' Initialisation à "blanc" des textes affichés, couleurs de case, de textes et du javascript de sélection des cases
couleur_integration="#992222" ' rouge foncé pour les sessions intégrations déjà fixées et non modifiables
couleur_selection="#929222" ' vert foncé pour les sessions de sélections déjà fixées et non modifiables
couleur_formation="#71205C" ' orange foncé pour les sessions de sélections déjà fixées et non modifiables
couleur_integration_prevu="#dd2200" ' rouge vif pour les sessions intégrations prévues et modifiables
couleur_selection_prevu="#009900" ' vert vif pour les sessions de sélections prévues et modifiabbles
couleur_formation_prevu="#B53CFD" ' orange vif pour les sessions de formations prévues et modifiabbles
couleur_integration_prevu="#FF9D8C" ' rouge vif pour les sessions intégrations prévues et modifiables
couleur_selection_prevu="#9FFF9F" ' vert vif pour les sessions de sélections prévues et modifiabbles
couleur_formation_prevu="#E3B8FE" ' orange vif pour les sessions de formations prévues et modifiabbles

for i=1 to 42
	for k=0 to 5
		' texte à afficher (pour l'instant un caractère blanc pour toutes les case du tableau) 
		texteaffiche(i,k)="&nbsp;"
		' couleur des cases : les cases des dates du mois demandé par l'utilisateur (mois de la date "datec") sont jaune paille, les autres sont blanches.
		if month(j(i))=month(datec) and year(j(i))=year(datec) and weekday(j(i))<>1 then ' date dans mois en cours oui
			couleurcase(i,k)="#FFFFCC" ' jaune paille 
		else ' date dans mois en cours non
			couleurcase(i,k)="#FFFFFF" ' blanc
		end if ' date dans mois en cours ?
		' couleur de texte, forme pointeur souris et code java (fonction de date dépassée ou non et de dimanche ou non)
		if cdate(j(i))<cdate(date) or weekday(j(i))=1 then ' date dépassée ou dimanche oui
			couleurtexte(i,k)="#DDDDDD" ' gris clair
			formesouris(i,k)="not-allowed" ' sens interdit
			javacase(i,k)=""
		else ' date dépassée ou dimanche non
			couleurtexte(i,k)="#000000" ' noir
			formesouris(i,k)="pointer" ' main
			javacase(i,k)="onclick=""selectionner('" & j(i) & "')"""
		end if ' date dépassée ou dimanche ?
	next
next









' Recherche de l'existant (qui n'est pas du prévisionnel donc pas à modifier dans cette page uniquement de prévisionnel) ====================================================================================
' recherche des intégrations affichées par la page pour la période entre les dates j(1) à j(42)
txtsql="SELECT codesession,datecontrat,heurecontrat,site FROM sessions WHERE datecontrat>='" & j(1) & "' AND datecontrat<='" & j(42) & "' ORDER BY datesession"
'response.write(txtsql) : response.end
set listedate = Server.CreateObject("ADODB.Recordset")
listedate.ActiveConnection = dsnrecrut
listedate.Source = txtsql
listedate.CursorType = 0
listedate.CursorLocation = 2
listedate.LockType = 3
listedate.Open()
i=1
while not listedate.eof
	for i=1 to 42
		if cdate(j(i))=cdate(listedate("datecontrat")) then ' date session = date de la case oui
			sit=ucase(trim(listedate("site")))
			k=lignesite(sit)
			texteaffiche(i,k)="I&nbsp;" & listedate("codesession") & " - " & sit & " (" & listedate("heurecontrat") & ")"
			couleurcase(i,k)=couleur_integration
			couleurtexte(i,k)="#ffffff"
			formesouris(i,k)="not-allowed" ' sens interdit
			javacase(i,k)=""
		end if ' date session = date de la case ?
	next
	i=i+1
	listedate.movenext
wend
listedate.Close()

' recherche des sélections affichées par la page pour la période entre les dates j(1) à j(42)
txtsql="SELECT codesession,dateselection,heureselection,sessionmax,site FROM sessions_dates_selections WHERE dateselection>='" & j(1) & "' AND dateselection<='" & j(42) & "' ORDER BY dateselection"
'response.write(txtsql) : response.end
set listedate = Server.CreateObject("ADODB.Recordset")
listedate.ActiveConnection = dsnrecrut
listedate.Source = txtsql
listedate.CursorType = 0
listedate.CursorLocation = 2
listedate.LockType = 3
listedate.Open()
i=1
while not listedate.eof
	for i=1 to 42
		if cdate(j(i))=cdate(listedate("dateselection")) then ' date=case oui
			sit=ucase(trim(listedate("site")))
			k=lignesite(sit)
			texteaffiche(i,k)="S&nbsp;" & listedate("codesession") & " - " & sit & " (" & listedate("heureselection") & ")"
			couleurcase(i,k)=couleur_selection
			couleurtexte(i,k)="#ffffff"
			formesouris(i,k)="not-allowed" ' sens interdit
			javacase(i,k)=""
		end if ' date = case ?
	next
	i=i+1
	listedate.movenext
wend
listedate.Close()

' recherche des formations affichées par la page pour la période entre les dates j(1) à j(42)
txtsql="SELECT codesession,dateformation,heureformation,sessionmax,site FROM sessions_dates_formations WHERE dateformation>='" & j(1) & "' AND dateformation<='" & j(42) & "' ORDER BY dateformation"
'response.write(txtsql) : response.end
set listedate = Server.CreateObject("ADODB.Recordset")
listedate.ActiveConnection = dsnrecrut
listedate.Source = txtsql
listedate.CursorType = 0
listedate.CursorLocation = 2
listedate.LockType = 3
listedate.Open()
i=1
while not listedate.eof
	for i=1 to 42
		if cdate(j(i))=cdate(listedate("dateformation")) then ' date=case oui
			sit=ucase(trim(listedate("site")))
			k=lignesite(sit)
			texteaffiche(i,k)="F&nbsp;" & listedate("codesession") & " - " & sit & " (" & listedate("heureformation") & ")"
			couleurcase(i,k)=couleur_formation
			couleurtexte(i,k)="#ffffff"
			formesouris(i,k)="not-allowed" ' sens interdit
			javacase(i,k)=""
		end if ' date = case ?
	next
	i=i+1
	listedate.movenext
wend
listedate.Close()










' Recherche du prévu (qui sont du prévisionnel donc modifiable dans cette page de prévisionnel) ========================================================================================
' recherche des intégrations pour la période entre les dates j(1) à j(42) affichée par la page
txtsql="SELECT cle,date_debut,heure_debut,site,code_session_mere FROM previsions_sessions WHERE nature='INT' AND date_debut>='" & j(1) & "' AND date_debut<='" & j(42) & "' AND validee=0 ORDER BY date_debut"
'response.write(txtsql) : response.end
set listedate = Server.CreateObject("ADODB.Recordset")
listedate.ActiveConnection = dsnrecrut
listedate.Source = txtsql
listedate.CursorType = 0
listedate.CursorLocation = 2
listedate.LockType = 3
listedate.Open()
i=1
while not listedate.eof
	for i=1 to 42
		if cdate(j(i))=cdate(listedate("date_debut")) then ' date=case oui
			sit=ucase(trim(listedate("site")))
			k=lignesite(sit)
			texteaffiche(i,k)="I&nbsp;" & listedate("cle") & " - " & sit & " (" & left(listedate("heure_debut"),5) & ")"
			couleurcase(i,k)=couleur_integration_prevu
			couleurtexte(i,k)="#ffffff"
			if cdate(j(i))<cdate(date) then ' date dépassée oui
				formesouris(i,k)="not-allowed" ' sens interdit
				javacase(i,k)="" ' pas de sélection de la case possible
			else ' date dépassée non
				formesouris(i,k)="pointer" ' main avec doigt levé
				javacase(i,k)="onclick=""modifier(" & trim(listedate("cle")) & ")"""
			end if ' date dépassée ?
		end if ' date = case ?
	next
	i=i+1
	listedate.movenext
wend
listedate.Close()

' recherche des sessions de sélection pour la période entre les dates j(1) à j(42) affichée par la page
txtsql="SELECT cle,date_debut,heure_debut,site,code_session_mere FROM previsions_sessions WHERE nature='SEL' AND date_debut>='" & j(1) & "' AND date_debut<='" & j(42) & "' AND validee=0 ORDER BY date_debut"
'response.write(txtsql) : response.end
set listedate = Server.CreateObject("ADODB.Recordset")
listedate.ActiveConnection = dsnrecrut
listedate.Source = txtsql
listedate.CursorType = 0
listedate.CursorLocation = 2
listedate.LockType = 3
listedate.Open()
i=1
while not listedate.eof
	for i=1 to 42
		if cdate(j(i))=cdate(listedate("date_debut")) then ' date=case oui
			sit=ucase(trim(listedate("site")))
			k=lignesite(sit)
			texteaffiche(i,k)="S&nbsp;" & listedate("code_session_mere") & " - " & sit & " (" & left(listedate("heure_debut"),5) & ")"
			couleurcase(i,k)=couleur_selection_prevu
			couleurtexte(i,k)="#ffffff"
			if cdate(j(i))<cdate(date) then ' date dépassée oui
				formesouris(i,k)="not-allowed" ' sens interdit
				javacase(i,k)="" ' pas de sélection de la case possible
			else ' date dépassée non
				formesouris(i,k)="pointer" ' main avec doigt levé
				javacase(i,k)="onclick=""modifier(" & trim(listedate("cle")) & ")"""
			end if ' date dépassée ?
		end if ' date = case ?
	next
	i=i+1
	listedate.movenext
wend
listedate.Close()

' recherche des sessions de formation pour la période entre les dates j(1) à j(42) affichée par la page
txtsql="SELECT cle,date_debut,heure_debut,site,code_session_mere FROM previsions_sessions WHERE nature='FOR' AND date_debut>='" & j(1) & "' AND date_debut<='" & j(42) & "' AND validee=0 ORDER BY date_debut"
'response.write(txtsql) : response.end
set listedate = Server.CreateObject("ADODB.Recordset")
listedate.ActiveConnection = dsnrecrut
listedate.Source = txtsql
listedate.CursorType = 0
listedate.CursorLocation = 2
listedate.LockType = 3
listedate.Open()
i=1
while not listedate.eof
	for i=1 to 42
		if cdate(j(i))=cdate(listedate("date_debut")) then ' date=case oui
			sit=ucase(trim(listedate("site")))
			k=lignesite(sit)
			texteaffiche(i,k)="F&nbsp;" & listedate("code_session_mere") & " - " & sit & " (" & left(listedate("heure_debut"),5) & ")"
			couleurcase(i,k)=couleur_formation_prevu
			couleurtexte(i,k)="#ffffff"
			if cdate(j(i))<cdate(date) then ' date dépassée oui
				formesouris(i,k)="not-allowed" ' sens interdit
				javacase(i,k)="" ' pas de sélection de la case possible
			else ' date dépassée non
				formesouris(i,k)="pointer" ' main avec doigt levé
				javacase(i,k)="onclick=""modifier(" & trim(listedate("cle")) & ")"""
			end if ' date dépassée ?
		end if ' date = case ?
	next
	i=i+1
	listedate.movenext
wend
listedate.Close()

' Fonctions spécifiques ================================================================================================================================================================
function lignesite(s)
	' retourne le numéro des lignes du site (Rochefort affiché en ligne 1, La Rochelle affichée en ligne 2, etc...)
	s=ucase(trim(s))
	select case s
		case "ROCHEFORT"
			lignesite=1
		case "LA ROCHELLE"
			lignesite=2
		case "BOURGES"
			lignesite=3
		case "TUNIS"
			lignesite=4
		case "ALGER"
			lignesite=5
	end select
end function

%>
<html>
<head>
<title>Pr&eacute;visionnel sessions</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="Styles/gboutons.css" type="text/css">
<SCRIPT SRC="Scripts/fctgene.js" LANGUAGE="JavaScript" TYPE="text/javascript"></SCRIPT>
<script language="JavaScript">
<!--

function selectionner(dat){
	url="recrut_gsp_ajout0.asp?dat="+dat;
	paramwin="top=5,left=50,height=350,width=750,scrollbars=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no";
	window.open(url,"",paramwin);
}

function modifier(clef){
	url="recrut_gsp_modif0.asp?cle="+clef;
	paramwin="top=5,left=50,height=350,width=750,scrollbars=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no";
	window.open(url,"",paramwin);
}

function ouvreaide(){
	window.open("aide.asp?sujet=Util_Div_Role","","top=10,left=10,height=740,width=980,scrollbar=no,toolbar=no,location=no,channelmode=no,status=no,menubar=no,resizable");
}


// -->
</script>
</head>
<body oncontextmenu="//return false">

<div id="ltitrepage" style="position:absolute; width:100%; height:28px; z-index:1; left:0; top:0"> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr> 
			<td width="10%" height="19" align="left"><img src="images/ivoo-logo.jpg" width="123" height="47" onClick="location.href='menusite.asp'" style="cursor: pointer;"></td>
			<td width="82%" height="19" bgcolor="<%=session("couleursite")%>" align="center"><span class="titrepage"><b>GIVOO</b>  | TLV | RECRUTEMENT | CALENDRIER PREVISIONNEL SESSIONS</span></td>
			<td width="8%" height="19" align="right"><input type="button" name="baide" value="Aide" class="baide" onClick="ouvreaide()"></td>
		</tr>
	</table>
	<hr>
</div>
	
	
<div id="ldefil" style="text-align:center; position:absolute; width:1120; height:35px; z-index:1; left:5; top:55; background-color: #000099; layer-background-color: #000099; border: 1px none #000000"> 
	<b><font face="Arial, Helvetica, sans-serif" size="5" color="#FFFFFF">
	<input type="button" name="btnrecule" value="&nbsp;&nbsp;&nbsp;<&nbsp;&nbsp;&nbsp;" onClick="location.href='recrut_gsp_menu.asp?step=m&datec=<%=date_premier_du_mois%>'">
	<%=nommois(month(date_premier_du_mois)) & " " & year(date_premier_du_mois)%>
	<input type="button" name="btnavance" value="&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;" onClick="location.href='recrut_gsp_menu.asp?step=p&datec=<%=date_premier_du_mois%>'">
	</font></b>
</div>


<div id="llegend" style="text-align:center; position:absolute; width:100; height:630px; z-index:1; left:1140; top:75; background-color: #CCCCCC; layer-background-color: #CCCCCC; border: 1px none #000000"> 
	<table width="99" border="0" cellspacing="3" cellpadding="0">
    <tr>
      <td align="center"><font face="Arial, Helvetica, sans-serif" size="1" color="#000000">Légende</font></td>
    </tr>
    <tr>
      <td align="center" bgcolor="<%=couleur_integration%>" height="30"><font face="Arial, Helvetica, sans-serif" size="1" color="#ffffff">Intégration PROD</font></td>
    </tr>
    <tr>
      <td align="center" bgcolor="<%=couleur_selection%>" height="30"><font face="Arial, Helvetica, sans-serif" size="1" color="#ffffff">S&eacute;lection PROD</font></td>
    </tr>
    <tr>
      <td align="center" bgcolor="<%=couleur_formation%>" height="30"><font face="Arial, Helvetica, sans-serif" size="1" color="#ffffff">Formation PROD</font></td>
    </tr>
    <tr>
      <td align="center"><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">&nbsp;</font></td>
    </tr>
    <tr>
      <td align="center" bgcolor="<%=couleur_integration_prevu%>" height="30"><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">Projet Intégration</font></td>
    </tr>
    <tr>
      <td align="center" bgcolor="<%=couleur_selection_prevu%>" height="30"><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">Projet S&eacute;lection</font></td>
    </tr>
    <tr>
      <td align="center" bgcolor="<%=couleur_formation_prevu%>" height="30"><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">Projet Formation</font></td>
    </tr>
       <tr>
      <td align="center"><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">&nbsp;</font></td>
    </tr>
       <tr>
      <td align="center"><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">&nbsp;</font></td>
    </tr>
       <tr>
      <td align="center"><input type="button" name="btncalend" value="Sessions Prévisions" onClick="ouvreetat('calendrier previsionnel','')" class="betats"></td>
      
    </tr>
     <tr>
      <td align="center"><font face="Arial, Helvetica, sans-serif" size="1" color="#FFFFFF">&nbsp;</font></td>
    </tr>
       <tr>
      <td align="center"><input type="button" name="btncalend" value="Sessions confirmées" onClick="ouvreetat('calendrier reeldatesessionv1','')" class="betats"></td>
      
    </tr>
  </table>
</div>


<div id="lretour" style="text-align:center; position:absolute; width:100; height:10px; z-index:2; left:1140; top:650; background-color: #CCCCCC; layer-background-color: #CCCCCC; border: 1px none #000000"> 
	<input type="button" name="btnretour" value="Retour" onClick="location.href='recrutgestsess.asp'" class="bretour">
</div>


<div id="lcal" style="position:absolute; width:1120; height:391px; z-index:2; left:5; top:85; background-color: #CCCCCC; layer-background-color: #CCCCCC; border: 1px none #000000"> 
	<table width="1120px" border="0" cellspacing="2" cellpadding="0">
		<tr bgcolor="#000099"> 
      <td width="160" align="center"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">dimanche</font></b></td>
			<td width="160" align="center"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">lundi</font></b></td>
      <td width="160" align="center"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">mardi</font></b></td>
      <td width="160" align="center"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">mercredi</font></b></td>
      <td width="160" align="center"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">jeudi</font></b></td>
      <td width="160" align="center"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">vendredi</font></b></td>
      <td width="160" align="center"><b><font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">samedi</font></b></td>
    </tr>
		<tr>
		<%for i=1 to 42
			if i>1 and (i-1) mod 7=0 then response.write("</tr><tr>")%>
				<td width="160" align="center"height="60">
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td align="center" bgcolor="<%=couleurcase(i,0)%>" style="cursor:not-allowed"><b><font face="Arial, Helvetica, sans-serif" size="2" color="<%=couleurtexte(i,0)%>"><%=j(i)%></font></b></td>
						</tr>
						<%for l=1 to 5%>
							<tr>
								<td align="center" bgcolor="<%=couleurcase(i,l)%>" style="cursor:<%=formesouris(i,l)%>" <%=javacase(i,l)%>><b><font face="Arial, Helvetica, sans-serif" size="1" color="<%=couleurtexte(i,l)%>"><%=texteaffiche(i,l)%></font></b></td>
							</tr>
						<%next%>
					</table>
				</td>
		<%next%>
	</table>
</div>
	
	
	
	 
</body>
</html>

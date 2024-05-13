<%@LANGUAGE="VBSCRIPT" %> 
<!--#include file="fctgene.asp" -->
<!--#include file="fctgene_courrier.asp" -->
<%
' v�rification de la session
if trim(session("identifiant"))="" then
	txtpageerreur="erreur.asp?titre=FIN DE SESSION&pageretour=menu0.htm&message=D�lai de connection expir�, merci de vous r�-identifier..." 
	response.redirect(txtpageerreur)
end if

' donn�es re�ues
cle_budget=request.querystring("cle_budget")
cle_prevision=request.querystring("cle_prevision")
cle_courrier=request.querystring("cle_courrier")

if cle_prevision<>"" then ' association pr�vision-courrier oui
	' Association du courrier � la pr�vision
	txtsql="UPDATE previsions SET cle_courrier=" & cle_courrier & " WHERE cle=" & cle_prevision
	exec_cde_sql txtsql,dsncompta
	' MAJ courrier
	txtsql="UPDATE courrier SET cle_prevision=" & cle_prevision & ", action='AUCUNE', statut='TRAITE', dh_statut=getdate(), auteur_statut=" & session("matricule") & " WHERE cle=" & cle_courrier
	exec_cde_sql txtsql,dsnivoo
end if ' association pr�vision-budget ?

if cle_budget<>"" then ' cr�ation pr�visions et association pr�vison-courrier oui
	' Transfert du budget vers pr�visions
	txtsql="INSERT INTO previsions ("
	txtsql=txtsql & "societe, code_journal, date_piece, date_saisie, auteur_saisie, no_compte_general, libelle_compte_general, no_compte_tiers, libelle_compte_tiers,"
	txtsql=txtsql & "cle_rubrique_treso, rubrique_treso, libelle_ecriture_prefixe, libelle_ecriture_mois, libelle_ecriture_annee, libelle_ecriture_trimestre,"
	txtsql=txtsql & "libelle_ecriture_beneficiaire, libelle_ecriture, date_echeance, no_semaine_echeance, date_ordo, no_semaine_ordo, debit, credit, code_operation,"
	txtsql=txtsql & "cle_ecriture, compte_regroupement, no_compte_banque, date_paiement, mode_reglement, statut, dh_statut, auteur_statut, manu, commentaire,"
	txtsql=txtsql & "date_solde, ref_source_tiers, cle_courrier, reference_paiement, cle_facture, code_tiers_payeur, inter, cle_accord_partenaire) "
	txtsql=txtsql & "SELECT "
	txtsql=txtsql & "societe, code_journal, date_piece, date_saisie, auteur_saisie, no_compte_general, libelle_compte_general, no_compte_tiers, libelle_compte_tiers,"
	txtsql=txtsql & "cle_rubrique_treso, rubrique_treso, libelle_ecriture_prefixe, libelle_ecriture_mois, libelle_ecriture_annee, libelle_ecriture_trimestre,"
	txtsql=txtsql & "libelle_ecriture_beneficiaire, libelle_ecriture, date_echeance, no_semaine_echeance, date_ordo, no_semaine_ordo, debit, credit, code_operation,"
	txtsql=txtsql & "cle_ecriture, compte_regroupement, no_compte_banque, date_paiement, mode_reglement, statut, dh_statut, auteur_statut, manu, commentaire,"
	txtsql=txtsql & "date_solde, ref_source_tiers, cle_courrier, reference_paiement, cle_facture, code_tiers_payeur, inter, cle_accord_partenaire "
	txtsql=txtsql & "FROM budget "
	txtsql=txtsql & "WHERE cle=" & cle_budget	
	cle_prevision=exec_cde_sql_id(txtsql,dsncompta)
	' MAJ budget
	txtsql="UPDATE budget SET cle_prevision=" & cle_prevision & ", statut='ENGAGE', dh_statut=getdate(), auteur_statut=" & session("matricule") & " WHERE cle=" & cle_budget
	exec_cde_sql txtsql,dsncompta
	' MAJ previsions et association du courrier � la pr�vision
	txtsql="UPDATE previsions SET cle_courrier=" & cle_courrier & ",cle_budget=" & cle_budget & " WHERE cle=" & cle_prevision
	exec_cde_sql txtsql,dsncompta
	' MAJ courrier
	txtsql="UPDATE courrier SET cle_prevision=" & cle_prevision & ", action='AUCUNE', statut='TRAITE', dh_statut=getdate(), auteur_statut=" & session("matricule") & " WHERE cle=" & cle_courrier
	exec_cde_sql txtsql,dsnivoo
end if ' cr�ation pr�visions et association pr�vison-courrier ?
%>
<html>
<head>
<title>Visu. Pr&eacute;visions</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<script language="JavaScript">
<!--
function chargepage(){
	window.opener.location.href="compta_modif_prevmanu0.asp?cle=<%=cle_prevision%>&cle_courrier=<%=cle_courrier%>";
	window.close();
}
//-->
</script>
</head>

<body onload="chargepage()">
</body>
</html>

<%@LANGUAGE="VBSCRIPT" %>
<!--#include file="fctgene.asp" -->
<%
' Données reçues
societe=trim(request.form("societe"))
unit_org=trim(request.form("unit_org"))
ss_unit_org=trim(request.form("ss_unit_org"))
libelle=sap(trim(request.form("libelle")))
description_detaillee=sap(trim(request.form("description_detaillee")))
classement_niv1=trim(request.form("classement_niv1")) : if classement_niv1="-1" then classement_niv1="0"
classement_niv2=trim(request.form("classement_niv2")) : if classement_niv2="-1" then classement_niv2="0"
classement_niv3=trim(request.form("classement_niv3")) : if classement_niv3="-1" then classement_niv3="0"

' Vérification doublon
txtsql="SELECT cle FROM dossiers WHERE libelle='" & libelle & "'"
set ctrl = Server.CreateObject("ADODB.Recordset")
ctrl.ActiveConnection = dsnivoo
ctrl.Source = txtsql
ctrl.Open()
if not ctrl.eof then ' dossier existe oui
	ctrl.Close()
	txturl="dossier_ajout0.asp"
	txturl=txturl & "?societe=" & sap(societe)
	txturl=txturl & "&unit_org=" & sap(unit_org)
	txturl=txturl & "&ss_unit_org=" & sap(ss_unit_org)
	txturl=txturl & "&libelle=" & sap(libelle)
	txturl=txturl & "&description_detaillee=" & sap(description_detaillee)
	txturl=txturl & "?message=Le dossier '" & libelle & "' existe déjà !..."
	response.redirect(txturl)
end if ' dossiers existe ?
ctrl.Close()

' Insertion
txtsql="INSERT INTO dossiers (societe,unit_org,ss_unit_org,libelle,description_detaillee,auteur_creation,auteur_statut,"
txtsql=txtsql & "classement_niv1,classement_niv2,classement_niv3) VALUES ('"
txtsql=txtsql & sap(societe) & "','" & sap(unit_org) & "','" & sap(ss_unit_org) & "','" & sap(libelle) & "','" & sap(description_detaillee) & "'," & session("matricule") & "," & session("matricule") & "," 
txtsql=txtsql & classement_niv1 & "," & classement_niv2 & "," & classement_niv3 & ")"
cle_dossier=exec_cde_sql_id(txtsql,dsnivoo)

' Ajout des matricules autorisés
txtsql="INSERT INTO dossiers_matricules_autorises (cle_dossier,matricule) SELECT " & cle_dossier & ",matricule FROM " & nom_base_personnel & ".dbo.employes WHERE sortie=0 AND unit_org='" & unit_org & "'"
exec_cde_sql txtsql,dsnivoo

' Insertion histo
txtsql="INSERT INTO dossiers_histo (cle_dossier,action,auteur_action,new_statut) VALUES (" & cle_dossier & ",'CREATION'," & session("matricule") & ",'EN_COURS')"
exec_cde_sql txtsql,dsnivoo

' Redirection
response.redirect("dossier_liste.asp")
%>

SELECT societe, code_fournisseur_societe_destinataire, societe_emettrice, code_fournisseur_societe_emettrice, cle_prevision, nature, action, nom_fichier, commentaire, date_piece, sens 
FROM courrier 
WHERE cle = [cle_courrier]


SELECT cle_rubrique_tresorerie, mode_paiement 
FROM fournisseurs 
WHERE code = [code_fournisseur_societe_destinataire]


SELECT TOP 1 cle 
FROM previsions 
WHERE ref_source_tiers = [code_fournisseur_societe_destinataire]


SELECT code, societe, rubrique_tresorerie 
FROM fournisseurs 
WHERE actif = 1 AND societe <> 'NC'
ORDER BY societe


SELECT cle_rubrique AS cle, libelle 
FROM fournisseurs_rubriques AS f 
JOIN [nom_base_compta].dbo.rubriques_previsions_tresorerie AS r 
ON f.cle_rubrique = r.cle 
WHERE code_fournisseur = [code_filtre_rubrique]


SELECT no_compte, nom_banque 
FROM banques_comptes_societes 
WHERE code_compta_societe = '[emetteur]' AND actif = 1 
ORDER BY nom_banque

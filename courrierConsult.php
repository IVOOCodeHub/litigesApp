<?php
header("Access-Control-Allow-Origin: *");  // Autorise les requêtes de n'importe quelle origine
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  // Autorise les méthodes spécifiques
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  // Aucun corps de réponse n'est nécessaire
  exit(0);
}
header('Content-Type: application/json');

$serverName = "SQL2"; // Ajustez selon vos configurations
$databaseName = "IVOO";
$userName = "sa";
$password = "";

try {
  $conn = new PDO("sqlsrv:server=$serverName;Database=$databaseName", $userName, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Définition des paramètres issus des inputs ou de l'URL
  $cle_courrier = $_GET['cle_courrier'];
  $code_fournisseur_societe_destinataire = $_GET['code_fournisseur_societe_destinataire'];
  $code_filtre_rubrique = $_GET['code_filtre_rubrique'];
  $emetteur = $_GET['emetteur'];

  // requete 1
  $stmt1 = $conn->prepare("SELECT societe, code_fournisseur_societe_destinataire, societe_emettrice, code_fournisseur_societe_emettrice, cle_prevision, nature, action, nom_fichier, commentaire, date_piece, sens FROM IVOO.dbo.courrier WHERE cle = ?");
  $stmt1->execute([$cle_courrier]);
  $courrierDetails = $stmt1->fetchAll(PDO::FETCH_ASSOC);

  // requete 2
  $stmt2 = $conn->prepare("SELECT cle_rubrique_tresorerie, mode_paiement FROM partenaires.dbo.fournisseurs WHERE code = ?");
  $stmt2->execute([$code_fournisseur_societe_destinataire]);
  $rubriqueDetails = $stmt2->fetchAll(PDO::FETCH_ASSOC);

  // requete 3
  $stmt3 = $conn->prepare("SELECT TOP 1 cle FROM compta.dbo.previsions WHERE ref_source_tiers = ?");
  $stmt3->execute([$code_fournisseur_societe_destinataire]);
  $previsionsExist = $stmt3->fetchAll(PDO::FETCH_ASSOC);

  // requete 4
  $stmt4 = $conn->prepare("SELECT code, societe, rubrique_tresorerie FROM partenaires.dbo.fournisseurs WHERE actif = 1 AND societe <> 'NC' ORDER BY societe");
  $stmt4->execute();
  $fournisseursList = $stmt4->fetchAll(PDO::FETCH_ASSOC);

  // requete 5
  $stmt5 = $conn->prepare("SELECT cle_rubrique AS cle, libelle FROM partenaires.dbo.fournisseurs_rubriques AS f JOIN compta.dbo.rubriques_previsions_tresorerie AS r ON f.cle_rubrique = r.cle WHERE code_fournisseur = ?");
  $stmt5->execute([$code_filtre_rubrique]);
  $rubriquesList = $stmt5->fetchAll(PDO::FETCH_ASSOC);

  // requete 6
  $stmt6 = $conn->prepare("SELECT no_compte, nom_banque FROM partenaires.dbo.banques_comptes_societes WHERE code_compta_societe = ? AND actif = 1 ORDER BY nom_banque");
  $stmt6->execute([$emetteur]);
  $comptesList = $stmt6->fetchAll(PDO::FETCH_ASSOC);

  // On combine tous les resultats dans un seul objet JSON
  $finalResults = [
    'courrierDetails' => $courrierDetails,
    'rubriqueDetails' => $rubriqueDetails,
    'previsionsExist' => $previsionsExist,
    'fournisseursList' => $fournisseursList,
    'rubriquesList' => $rubriquesList,
    'comptesList' => $comptesList
  ];
  echo json_encode($finalResults);

} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

?>
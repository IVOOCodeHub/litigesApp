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

  // Prepare and execute the first query
  $stmt = $conn->prepare("SELECT cle, societe, societe_emettrice, dh_saisie, auteur_saisie, nom_fichier, nature, ref_doc, sens, mat_mark FROM IVOO.dbo.courrier WHERE statut='SAISI' AND sens=? AND societe=? AND societe_emettrice=? ORDER BY ?");
  $stmt->execute([$sens, $f_societe, $f_Emetteur, $tri]);
  $courriers = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Prepare and execute the second query
  $stmt = $conn->prepare("SELECT Count(cle) AS n, societe AS nomsociete FROM IVOO.dbo.courrier WHERE statut='SAISI' AND sens=? GROUP BY societe ORDER BY societe");
  $stmt->execute([$sens]);
  $societes = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Prepare and execute the third query
  $stmt = $conn->prepare("SELECT Count(cle) AS n, societe_emettrice AS nomEmetteur FROM IVOO.dbo.courrier WHERE statut='SAISI' AND sens=? GROUP BY societe_emettrice ORDER BY societe_emettrice");
  $stmt->execute([$sens]);
  $emetteurs = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Combine all results into one JSON object
  $results = ['courriers' => $courriers, 'societes' => $societes, 'emetteurs' => $emetteurs];
  echo json_encode($results);

} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

?>
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

  // Requête pour obtenir la liste des sociétés filtrée
  $sql = "SELECT cle, societe, action, dh_saisie, auteur_saisie, service, action, commentaire, statut, nature, societe_emettrice FROM IVOO.dbo.courrier
WHERE service='FINANCE'
AND statut='DISTRIBUE'
AND action='A TRAITER'
AND cle_prevision=0
AND date_piece>'31/12/2017 23:59:59'
AND nature<>'FACTUREC' AND nature<>'CHEQUE' AND nature<>'ACCORD PART'
ORDER BY cle";

  $stmt = $conn->prepare($sql);
  $stmt->execute();
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($results);
} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
?>
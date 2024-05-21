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

  // Requête SQL unique
  $sql = "SELECT cle,
                societe,
                tiers,
                nom,
                commentaire,
                conseil,
                theme,
                multiple,
                statut,
                datedebut,
                datefin,
                datepaction,
                paction
          FROM IVOO.dbo.litiges_dossier
          ORDER BY datedebut;";

  $stmt = $conn->prepare($sql);
  $stmt->execute();
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Renvoie des résultats sous forme de JSON
  echo json_encode($results);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
}
?>
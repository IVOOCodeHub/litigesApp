<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  exit(0);
}

header('Content-Type: application/json');

$serverName = "SQL2";
$databaseName = "IVOO";
$userName = "sa";
$password = "";

try {
  $conn = new PDO("sqlsrv:server=$serverName;Database=$databaseName", $userName, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Première requête
  $sql1 = "SELECT Count(cle) AS n, societe 
            FROM IVOO.dbo.courrier
            WHERE service='FINANCE' AND statut='DISTRIBUE' AND action='A TRAITER'
            AND cle_prevision=0 AND cle_paiement=0 AND date_piece > '2017-12-31 23:59:59'
            AND nature LIKE '%LITIGE%'
            GROUP BY societe 
            ORDER BY societe;";
  $stmt1 = $conn->prepare($sql1);
  $stmt1->execute();
  $results1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);

  // Deuxième requête
  $sql2 = "SELECT cle, societe, action, dh_saisie, auteur_saisie, nom_fichier, service, action, commentaire, statut, nature, societe_emettrice 
            FROM IVOO.dbo.courrier
            WHERE service='FINANCE' AND statut='DISTRIBUE' AND action='A TRAITER'
            AND cle_prevision=0 AND date_piece > '2017-12-31 23:59:59'
            AND nature LIKE '%LITIGE%'
            ORDER BY cle;";
  $stmt2 = $conn->prepare($sql2);
  $stmt2->execute();
  $results2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

  // Troisième requête
  $sql3 = "SELECT nature_piece 
            FROM IVOO.dbo.courrier_profils_distribution
            GROUP BY nature_piece 
            ORDER BY nature_piece;";
  $stmt3 = $conn->prepare($sql3);
  $stmt3->execute();
  $results3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);

  // Combinez tous les résultats en un seul objet JSON
  $finalResults = [
    'societes' => $results1,
    'courriers' => $results2,
    'nature_pieces' => $results3
  ];
  echo json_encode($finalResults);

} catch (PDOException $e) {
  echo json_encode(['error' => "Connection failed: " . $e->getMessage()]);
}

?>
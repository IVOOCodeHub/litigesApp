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

  // Récupérer les filtres à partir des paramètres GET ou POST (assurez-vous de les valider et de les nettoyer)
  $filtre_unit_org = $_GET['filtre_unit_org'] ?? 'TOUTES';
  $filtre_ss_unit_org = $_GET['filtre_ss_unit_org'] ?? 'TOUTES';
  $filtre_statut = $_GET['filtre_statut'] ?? 'TOUS';
  $filtre_societe = $_GET['filtre_societe'] ?? 'TOUTES';
  $champ_tri = $_GET['champ_tri'] ?? 'date_creation'; // Exemple de champ de tri par défaut
  $ordre_tri = $_GET['ordre_tri'] ?? 'ASC'; // Ordre de tri

  // Liste des dossiers
  $sql = "SELECT d.cle, societe, libelle, description_detaillee, date_creation, auteur_creation, statut, date_statut, auteur_statut
            FROM dossiers AS d
            LEFT JOIN dossiers_matricules_autorises AS a ON d.cle = a.cle_dossier
            WHERE 1=1 ";
  if ($filtre_unit_org !== "TOUTES") {
    $sql .= " AND unit_org = ?";
    $params[] = $filtre_unit_org;
  }
  if ($filtre_ss_unit_org !== "TOUTES") {
    $sql .= " AND ss_unit_org = ?";
    $params[] = $filtre_ss_unit_org;
  }
  if ($filtre_statut !== "TOUS") {
    $sql .= " AND statut = ?";
    $params[] = $filtre_statut;
  }
  if ($filtre_societe !== "TOUTES") {
    $sql .= " AND societe = ?";
    $params[] = $filtre_societe;
  }
  $sql .= " GROUP BY d.cle, societe, libelle, description_detaillee, date_creation, auteur_creation, statut, date_statut, auteur_statut ";
  $sql .= " ORDER BY " . $conn->quote($champ_tri) . " " . $conn->quote($ordre_tri);

  $stmt = $conn->prepare($sql);
  $stmt->execute($params);
  $dossiers = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Liste des sociétés
  $sqlSocietes = "SELECT code_compta, nomsociete FROM societes WHERE active=1 ORDER BY nomsociete";
  $stmt = $conn->prepare($sqlSocietes);
  $stmt->execute();
  $societes = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Liste des unités
  $sqlUnits = "SELECT libelle FROM uo_unites ORDER BY libelle";
  $stmt = $conn->prepare($sqlUnits);
  $stmt->execute();
  $unites = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Liste des sous-unités
  $sqlSubUnits = "SELECT libelle FROM uo_sous_unites ORDER BY libelle";
  $stmt = $conn->prepare($sqlSubUnits);
  $stmt->execute();
  $sousUnites = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Combine all results into one JSON object
  $results = [
    'dossiers' => $dossiers,
    'societes' => $societes,
    'unites' => $unites,
    'sousUnites' => $sousUnites
  ];
  echo json_encode($results);

} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

?>
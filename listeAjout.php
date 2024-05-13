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

  // Récupération et nettoyage des données reçues
  $societe = trim($_POST['societe']);
  $unit_org = trim($_POST['unit_org']);
  $ss_unit_org = trim($_POST['ss_unit_org']);
  $libelle = trim($_POST['libelle']); // Assurez-vous de gérer correctement les apostrophes et autres caractères spéciaux
  $description_detaillee = trim($_POST['description_detaillee']);
  $classement_niv1 = trim($_POST['classement_niv1']) != '-1' ? trim($_POST['classement_niv1']) : '0';
  $classement_niv2 = trim($_POST['classement_niv2']) != '-1' ? trim($_POST['classement_niv2']) : '0';
  $classement_niv3 = trim($_POST['classement_niv3']) != '-1' ? trim($_POST['classement_niv3']) : '0';

  // Vérification de l'existence d'un doublon
  $stmt = $conn->prepare("SELECT cle FROM dossiers WHERE libelle = ?");
  $stmt->execute([$libelle]);
  if ($stmt->fetch()) {
    // Redirection si un doublon est trouvé
    echo json_encode(['error' => "Le dossier '$libelle' existe déjà !"]);
    exit;
  }

  // Insertion du nouveau dossier
  $stmt = $conn->prepare("INSERT INTO dossiers (societe, unit_org, ss_unit_org, libelle, description_detaillee,
auteur_creation, auteur_statut, classement_niv1, classement_niv2, classement_niv3)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  $stmt->execute([
    $societe,
    $unit_org,
    $ss_unit_org,
    $libelle,
    $description_detaillee,
    $_SESSION['matricule'],
    $_SESSION['matricule'],
    $classement_niv1,
    $classement_niv2,
    $classement_niv3
  ]);
  $cle_dossier = $conn->lastInsertId();

  // Ajout des matricules autorisés
  $stmt = $conn->prepare("INSERT INTO dossiers_matricules_autorises (cle_dossier, matricule)
SELECT ?, matricule FROM employes WHERE sortie = 0 AND unit_org = ?");
  $stmt->execute([$cle_dossier, $unit_org]);

  // Insertion historique
  $stmt = $conn->prepare("INSERT INTO dossiers_histo (cle_dossier, action, auteur_action, new_statut) VALUES (?,
'CREATION', ?, 'EN_COURS')");
  $stmt->execute([$cle_dossier, $_SESSION['matricule']]);

  // Retour succès
  echo json_encode(['success' => "Dossier '$libelle' créé avec succès."]);

} catch (PDOException $e) {
  echo json_encode(['error' => "Erreur de connexion : " . $e->getMessage()]);
}

?>
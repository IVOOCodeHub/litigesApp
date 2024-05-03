<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: content-type");
header('Content-Type: application/json');

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$serverName = "SQL2";
$databaseName = "personnel";
$userName = "sa";
$password = "";

$site = isset($json_obj['site']) ? $json_obj['site'] : 'default_site';
$userLogin = isset($json_obj['login']) ? $json_obj['login'] : 'default_userLogin';
$userPassword = isset($json_obj['password']) ? $json_obj['password'] : 'default_userPassword';

try {
    $conn = new PDO("sqlsrv:server=$serverName;Database=$databaseName", $userName, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $results = performQuery($conn, $site, $userLogin, $userPassword);
    echo json_encode($results);
} catch (PDOException $e) {
    error_log("Connection failed: " . $e->getMessage());  // Log the error
    echo json_encode(['error' => 'Service unavailable']);
    die();
}

function performQuery($conn, $site, $userLogin, $userPassword)
{
    if ($site == "TO") {
        $sql = "SELECT dbo.cadres.*
                FROM dbo.cadres
                INNER JOIN webadmin.dbo.Ident ON webadmin.dbo.Ident.Ident = dbo.cadres.matricule
                WHERE dbo.cadres.matricule = :userLogin
                AND webadmin.dbo.Ident.Password = :userPassword";
    } elseif ($site == "USV") {
        $sql = "SELECT dbo.cadres.*
                FROM dbo.cadres
                WHERE dbo.cadres.code = :userLogin
                AND dbo.cadres.mdp = :userPassword";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':userLogin', $userLogin);
    $stmt->bindParam(':userPassword', $userPassword);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $results ?: ['error' => 'Invalid login or password'];
}
?>
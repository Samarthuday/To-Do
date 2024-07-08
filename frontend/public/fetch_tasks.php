<?php
session_start();
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $userTable = "user_" . md5($_SESSION['email']);

    $sql = "SELECT * FROM $userTable where status != 'deleted'";
    $result = $conn->query($sql);

    $tasks = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
    }


echo json_encode($tasks);
$conn->close();
}
?>

<?php
session_start();
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $task = $_POST['task'];
    $status = $_POST['status'];
    $userTable = "user_" . md5($_SESSION['email']);

    $sql = "UPDATE $userTable SET status='$status' WHERE task='$task'";

    if ($conn->query($sql) === TRUE) {
        echo "Task status updated successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>

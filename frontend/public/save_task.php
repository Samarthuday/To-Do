<?php
session_start();
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $task = $_POST['task'];
    $due_date = $_POST['due_date'];
    $due_time = $_POST['due_time'];
    $priority = $_POST['priority'];
    $category = $_POST['category'];
    $status = $_POST['status'];
    $user_id = $_SESSION['user_id'];
    $userTable = "user_" . md5($_SESSION['email']);

    $sql = "INSERT INTO $userTable (task, due_date, due_time, priority, category, status, actions) 
            VALUES ('$task', '$due_date','$due_time', '$priority', '$category', '$status', '')";

    if ($conn->query($sql) === TRUE) {
        echo "Task saved successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>

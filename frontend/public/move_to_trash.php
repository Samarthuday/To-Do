<?php
include "config.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $task = $_POST['task'];
    $userTable = "user_" . md5($_SESSION['email']);
    $deletedTasksFile = "deleted_tasks_" . md5($_SESSION['email']) . ".txt";

    // Delete task from the database
    $sql = "DELETE FROM $userTable WHERE task='$task'";

    if ($conn->query($sql) === TRUE) {
        // Append task to deleted tasks file
        file_put_contents($deletedTasksFile, $task . "\n", FILE_APPEND);
        echo "Task moved to trash successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>


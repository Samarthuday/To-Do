<?php
session_start();

// Assuming 'config.php' includes database connection details
include "config.php";

// Construct user-specific table name
    $email = $_SESSION['email'];
    $userTable = "user_" . md5($email);

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and retrieve task data from the request
    $task = sanitize_input($_POST['task']);

    // Prepare SQL statement to update task status to 'deleted'
    $sql = "UPDATE $userTable SET status = 'deleted' WHERE task = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $task);

    // Execute the statement
    if ($stmt->execute()) {
        // Return success response
        $response = [
            'status' => 'success',
            'message' => 'Task deleted successfully.'
        ];
        echo json_encode($response);
    } else {
        // Return error response
        $response = [
            'status' => 'error',
            'message' => 'Failed to delete task from database.'
        ];
        echo json_encode($response);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    // If request method is not POST, return error response
    $response = [
        'status' => 'error',
        'message' => 'Invalid request method.'
    ];
    echo json_encode($response);
}

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>

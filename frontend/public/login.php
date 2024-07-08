<?php
include "config.php";

// Initialize variables for form data
$email = "";
$password = "";

// Form submission handling
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate form inputs
    $email = sanitize_input($_POST['email']);
    $password = $_POST['password'];

    // Query to fetch user from database
    $sql = "SELECT * FROM users WHERE email='$email' LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        // User found, verify password
        $user = $result->fetch_assoc();
        $pass = $user['password'];
        if (password_verify($password, password_hash($pass, PASSWORD_DEFAULT))) {
            // Password verified, start session and redirect to main.html
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $email;  // Store user ID in session
            header("Location: main.html");
            
            // Create a unique table name for the user
            $userTable = "user_" . md5($email);
            // Create table query
            $createTableQuery = "CREATE TABLE IF NOT EXISTS $userTable (
                id INT(11) AUTO_INCREMENT PRIMARY KEY,
                task VARCHAR(255) NOT NULL,
                due_date DATE NOT NULL,
                due_time TIME NOT NULL,
                priority varchar(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                status VARCHAR(50) NOT NULL,
                actions TEXT NOT NULL
            )";
            mysqli_query($conn, $createTableQuery);

            // Create a text file for deleted tasks
            $deletedTasksFile = "deleted_tasks_" . md5($email) . ".txt";
            if (!file_exists($deletedTasksFile)) {
                file_put_contents($deletedTasksFile, "Deleted Tasks:\n");
            }
            
            exit();
        } else {
            // Invalid password
            echo '<script>';
            echo 'alert("Invalid username or password!");';
            echo 'window.location.href = "login.html";';  // Redirect to login page
            echo '</script>';
        }
    } else {
        // User not found
        echo '<script>';
        echo 'alert("No Such user exists!!");';
        echo 'window.location.href = "login.html";';  // Redirect to login page
        echo '</script>';
    }
}

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Close connection
$conn->close();
?>

<?php
// Database configuration
$servername = "localhost";  // Replace with your MySQL server name
$username = "root";     // Replace with your MySQL username
$password = "";     // Replace with your MySQL password
$dbname = "to_do_list";       // Replace with your MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Initialize variables for form data
$email = "";$password = "";

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
            $_SESSION['user_id'] = $user['id'];  // Store user ID in session
            header("Location: main.html");
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

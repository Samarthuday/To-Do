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

// Form submission handling
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];  // Note: Password should be hashed for security
    // You can hash the password using PHP's password_hash function
    // Example: $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user data into database
    $sql = "INSERT INTO users  VALUES ('$name', '$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        // Successful signup
        echo '<script>';
        echo 'alert("Successfully signed up!");';
        echo 'window.location.href = "login.html";';  // Redirect to login page
        echo '</script>';
    } else {
        // Error in query execution
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close connection
$conn->close();
?>

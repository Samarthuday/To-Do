<?php
include 'config.php';

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

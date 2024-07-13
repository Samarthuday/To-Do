<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);
    
    $feedback = "Name: $name\nEmail: $email\nMessage: $message\n\n";
    file_put_contents('feedback_contents.txt', $feedback, FILE_APPEND);

    echo "<script>alert('Feedback submitted successfully!'); window.location.href = 'index.html';</script>";
}
?>

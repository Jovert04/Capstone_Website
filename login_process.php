<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Default credentials for demo purposes
    $default_username = "CEFA-ADMIN";
    $default_password = "PassKey#CEAFA";

    if ($username == $default_username && $password == $default_password) {
        $_SESSION['logged_in'] = true;
        header('Location: dashboard.php');
        exit;
    } else {
        $error_message = "Invalid username or password!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Smart Parking</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Your existing login page styles */
    </style>
</head>
<body>
    <!-- Login Form -->
    <div class="login-form-container">
        <h2>Admin Login</h2>
        
        <!-- Show error message if credentials are wrong -->
        <?php if (isset($error_message)): ?>
            <div class="error-message"><?php echo $error_message; ?></div>
        <?php endif; ?>

        <form action="login.php" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>

<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smart_parking_system";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['count'])) {
    $count = $_POST['count'];
    $day = date('d');
    $month = date('m');
    $year = date('Y');

    // Insert or update the parked car count for the current day
    $sql = "INSERT INTO parked_cars (day, month, year, count) VALUES ($day, $month, $year, $count)
            ON DUPLICATE KEY UPDATE count=$count";

    if ($conn->query($sql) === TRUE) {
        echo "Parked count updated successfully";
    } else {
        echo "Error: " . $conn->error;
    }
}

$conn->close();
?>

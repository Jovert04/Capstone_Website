<?php
// Get input values from the POST request
$day = $_POST['day'];
$month = $_POST['month'];
$year = $_POST['year'];

// Connect to your database (ensure to replace these with your actual DB credentials)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smart_parking"; // Replace with your actual database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare the SQL query to count cars for the selected date
$sql = "SELECT COUNT(*) AS car_count FROM parking_data WHERE DAY(parking_time) = ? AND MONTH(parking_time) = ? AND YEAR(parking_time) = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $day, $month, $year);
$stmt->execute();
$stmt->bind_result($car_count);
$stmt->fetch();

// Return the result as the response
echo $car_count;

$stmt->close();
$conn->close();
?>

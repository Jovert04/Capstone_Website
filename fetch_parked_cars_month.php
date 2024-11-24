<?php
// Get input values from the POST request
$month = $_POST['month'];
$year = $_POST['year'];

// Connect to your database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smart_parking"; // Replace with your actual database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare the SQL query to count cars for the selected month
$sql = "SELECT COUNT(*) AS car_count FROM parking_data WHERE MONTH(parking_time) = ? AND YEAR(parking_time) = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $month, $year);
$stmt->execute();
$stmt->bind_result($car_count);
$stmt->fetch();

// Return the result as the response
echo $car_count;

$stmt->close();
$conn->close();
?>
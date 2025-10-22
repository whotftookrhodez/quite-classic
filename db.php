<?php
$host = 'localhost';
$db = 'user_system';
$user = 'root';
$pass = '';

$mysqli = new mysqli($host, $user, $pass, $db);

if ($mysqli->connect_error) {
    die("connect error: " . $mysqli->connect_error);
}
?>
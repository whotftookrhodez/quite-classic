<?php

session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit;
}
echo "welcome, user id #" . $_SESSION['user_id'] . ". <a href='logout.php'>log out</a>";
?>
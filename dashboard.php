<?php

session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login");
    exit;
}

echo "Welcome, user id #" . $_SESSION['user_id'] . ". <a href='logout'>log out</a>";
?>
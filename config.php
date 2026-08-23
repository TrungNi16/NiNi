<?php
// Cấu hình kết nối database
$host = 'localhost'; // Thay bằng host của bạn (VD: sql123.yourhosting.com)
$dbname = 'nini_store';
$username = 'root'; // Thay bằng username database
$password = ''; // Thay bằng password database

try {
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Kết nối thất bại: " . $conn->connect_error);
    }
    
    // Thiết lập charset UTF-8
    $conn->set_charset("utf8mb4");
    
} catch (Exception $e) {
    die("Lỗi kết nối database: " . $e->getMessage());
}
?>

<?php
session_start();
require_once 'config.php';

// Nếu đã đăng nhập thì chuyển đến trang chủ
if (isset($_SESSION['user_id'])) {
    header('Location: home.php');
    exit();
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['register'])) {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $confirm = $_POST['confirm'];
    $captcha = (int)$_POST['captcha'];
    
    // Kiểm tra captcha (9+2=11)
    if ($captcha != 11) {
        $error = "❌ Sai mã xác nhận!";
    } elseif (strlen($username) < 3) {
        $error = "❌ Tên đăng nhập phải có ít nhất 3 ký tự!";
    } elseif (strlen($password) < 6) {
        $error = "❌ Mật khẩu phải có ít nhất 6 ký tự!";
    } elseif ($password !== $confirm) {
        $error = "❌ Mật khẩu nhập lại không khớp!";
    } else {
        // Kiểm tra username đã tồn tại
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $error = "❌ Tài khoản đã tồn tại!";
        } else {
            // Mã hóa mật khẩu và lưu
            $hashed = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $username, $hashed);
            
            if ($stmt->execute()) {
                $success = "✅ Đăng ký thành công! <a href='index.php'>Đăng nhập ngay</a>";
            } else {
                $error = "❌ Lỗi hệ thống, vui lòng thử lại!";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng Ký - NiNi Store</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="logo">
            <h1>🌟 NINI STORE</h1>
            <p>Free Fire Code Shop</p>
        </div>
        
        <h2>ĐĂNG KÝ</h2>
        
        <?php if ($error): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <?php if ($success): ?>
            <div class="success"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <form method="POST" autocomplete="off">
            <div class="form-group">
                <label>👤 Tài khoản</label>
                <input type="text" name="username" placeholder="Tối thiểu 3 ký tự" required>
            </div>
            
            <div class="form-group">
                <label>🔒 Mật khẩu</label>
                <input type="password" name="password" placeholder="Tối thiểu 6 ký tự" required>
            </div>
            
            <div class="form-group">
                <label>✅ Nhập lại mật khẩu</label>
                <input type="password" name="confirm" placeholder="Nhập lại mật khẩu" required>
            </div>
            
            <div class="form-group captcha-group">
                <label>🧮 Giải phép tính: 9 + 2 = ?</label>
                <input type="number" name="captcha" placeholder="Nhập kết quả" required>
            </div>
            
            <div class="buttons">
                <button type="reset" class="btn-cancel">HỦY</button>
                <button type="submit" name="register" class="btn-submit">XÁC NHẬN</button>
            </div>
        </form>
        
        <p class="register-link">
            Đã có tài khoản? <a href="index.php">Đăng nhập</a>
        </p>
    </div>
</body>
</html>

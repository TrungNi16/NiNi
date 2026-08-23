<?php
session_start();
require_once 'config.php';

// Nếu đã đăng nhập thì chuyển đến trang chủ
if (isset($_SESSION['user_id'])) {
    header('Location: home.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])) {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $captcha = (int)$_POST['captcha'];
    
    // Kiểm tra captcha (3+1=4)
    if ($captcha != 4) {
        $error = "❌ Sai mã xác nhận!";
    } elseif (empty($username) || empty($password)) {
        $error = "❌ Vui lòng nhập đầy đủ thông tin!";
    } else {
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($user = $result->fetch_assoc()) {
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['vip_level'] = $user['vip_level'];
                header('Location: home.php');
                exit();
            } else {
                $error = "❌ Sai mật khẩu!";
            }
        } else {
            $error = "❌ Tài khoản không tồn tại!";
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng Nhập - NiNi Store</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="logo">
            <h1>🌟 NINI STORE</h1>
            <p>Free Fire Code Shop</p>
        </div>
        
        <h2>ĐĂNG NHẬP</h2>
        
        <?php if ($error): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form method="POST" autocomplete="off">
            <div class="form-group">
                <label>👤 Tài khoản</label>
                <input type="text" name="username" placeholder="Nhập tên đăng nhập" required>
            </div>
            
            <div class="form-group">
                <label>🔒 Mật khẩu</label>
                <input type="password" name="password" placeholder="Nhập mật khẩu" required>
            </div>
            
            <div class="form-group captcha-group">
                <label>🧮 Giải phép tính: 3 + 1 = ?</label>
                <input type="number" name="captcha" placeholder="Nhập kết quả" required>
            </div>
            
            <div class="buttons">
                <button type="reset" class="btn-cancel">HỦY</button>
                <button type="submit" name="login" class="btn-submit">VÀO WEB</button>
            </div>
        </form>
        
        <p class="register-link">
            Chưa có tài khoản? <a href="register.php">Đăng ký ngay</a>
        </p>
    </div>
</body>
</html>

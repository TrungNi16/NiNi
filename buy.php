<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}
require_once 'config.php';

$user_id = $_SESSION['user_id'];
$code_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($code_id <= 0) {
    header('Location: home.php');
    exit();
}

// Lấy thông tin code và user
$stmt = $conn->prepare("SELECT * FROM codes WHERE id = ?");
$stmt->bind_param("i", $code_id);
$stmt->execute();
$code = $stmt->get_result()->fetch_assoc();

$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$code || !$user) {
    die("❌ Dữ liệu không hợp lệ!");
}

$message = '';

// Xử lý mua
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['confirm'])) {
    if ($code['stock'] <= 0) {
        $message = "❌ Code đã hết hàng!";
    } elseif ($user['points'] < $code['price']) {
        $message = "❌ Bạn không đủ điểm! Cần " . number_format($code['price']) . "đ, bạn có " . number_format($user['points']) . "đ";
    } else {
        // Bắt đầu transaction
        $conn->begin_transaction();
        
        try {
            // Trừ điểm user
            $new_points = $user['points'] - $code['price'];
            $stmt = $conn->prepare("UPDATE users SET points = ? WHERE id = ?");
            $stmt->bind_param("ii", $new_points, $user_id);
            $stmt->execute();
            
            // Giảm số lượng code
            $new_stock = $code['stock'] - 1;
            $stmt = $conn->prepare("UPDATE codes SET stock = ? WHERE id = ?");
            $stmt->bind_param("ii", $new_stock, $code_id);
            $stmt->execute();
            
            // Ghi lịch sử mua hàng
            $stmt = $conn->prepare("INSERT INTO purchase_history (user_id, code_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $user_id, $code_id);
            $stmt->execute();
            
            $conn->commit();
            
            $message = "✅ Mua thành công! Mã code của bạn là: <strong>" . htmlspecialchars($code['code_value']) . "</strong>";
            
            // Cập nhật lại thông tin user
            $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $user = $stmt->get_result()->fetch_assoc();
            
        } catch (Exception $e) {
            $conn->rollback();
            $message = "❌ Lỗi xử lý giao dịch!";
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận mua - NiNi Store</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <nav class="sidebar">
            <div class="sidebar-brand">
                <h2>🌟 NINI STORE</h2>
            </div>
            <ul class="sidebar-menu">
                <li><a href="home.php">🏠 Trang chủ</a></li>
                <li><a href="#">📋 Nhiệm vụ</a></li>
                <li><a href="#">🛒 Đối điểm</a></li>
                <li><a href="#">💰 Nạp Tiền</a></li>
            </ul>
            <div class="sidebar-footer">
                <div class="user-info">
                    <span class="user-avatar">👤</span>
                    <div>
                        <strong><?php echo htmlspecialchars($user['username']); ?></strong>
                        <span>💰 <?php echo number_format($user['points']); ?>đ</span>
                    </div>
                </div>
                <a href="logout.php" class="logout-btn">🚪 Đăng xuất</a>
            </div>
        </nav>
        
        <main class="content">
            <div class="buy-container">
                <h1>🛒 XÁC NHẬN MUA</h1>
                
                <?php if ($message): ?>
                    <div class="message <?php echo strpos($message, '✅') !== false ? 'success' : 'error'; ?>">
                        <?php echo $message; ?>
                    </div>
                <?php endif; ?>
                
                <div class="buy-details">
                    <div class="detail-item">
                        <span class="label">📦 Sản phẩm:</span>
                        <span class="value"><?php echo htmlspecialchars($code['code_name']); ?></span>
                    </div>
                    <div class="detail-item">
                        <span class="label">💰 Giá:</span>
                        <span class="value"><?php echo number_format($code['price']); ?>đ</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">📦 Tồn kho:</span>
                        <span class="value"><?php echo $code['stock']; ?> code</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">👤 Số dư của bạn:</span>
                        <span class="value <?php echo $user['points'] >= $code['price'] ? 'text-success' : 'text-danger'; ?>">
                            <?php echo number_format($user['points']); ?>đ
                        </span>
                    </div>
                </div>
                
                <div class="buy-actions">
                    <a href="home.php" class="btn-cancel">⬅ Quay lại</a>
                    <?php if ($user['points'] >= $code['price'] && $code['stock'] > 0 && !$message): ?>
                        <form method="POST" style="display:inline;">
                            <button type="submit" name="confirm" class="btn-submit">✅ Xác nhận mua</button>
                        </form>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</body>
</html>

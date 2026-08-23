<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}
require_once 'config.php';

// Lấy thông tin user
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Lấy danh sách code
$codes = $conn->query("SELECT * FROM codes ORDER BY category, price ASC");
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NiNi Store - Trang chủ</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <nav class="sidebar">
            <div class="sidebar-brand">
                <h2>🌟 NINI STORE</h2>
            </div>
            
            <ul class="sidebar-menu">
                <li class="active"><a href="home.php">🏠 Trang chủ</a></li>
                <li><a href="#">📋 Nhiệm vụ</a></li>
                <li><a href="#">🛒 Đối điểm</a></li>
                <li><a href="#">💰 Nạp Tiền</a></li>
                <li><a href="#">🔧 Công Cụ</a></li>
                <li><a href="#">🎁 Nhập Giftcode</a></li>
                <li><a href="#">⚡ Flash Sale Cloud</a></li>
                <li><a href="#">🏆 Bảng Xếp Hạng</a></li>
                <li><a href="#">📜 Lịch sử mua hàng</a></li>
                <li><a href="#">📜 Lịch sử nhiệm vụ</a></li>
                <li><a href="#">☁️ Cloud Free Mobile Ngày</a></li>
                <li><a href="#">⚙️ Trung Tâm</a></li>
            </ul>
            
            <div class="sidebar-footer">
                <div class="user-info">
                    <span class="user-avatar">👤</span>
                    <div>
                        <strong><?php echo htmlspecialchars($user['username']); ?></strong>
                        <span>VIP <?php echo $user['vip_level']; ?></span>
                    </div>
                </div>
                <a href="logout.php" class="logout-btn">🚪 Đăng xuất</a>
            </div>
        </nav>
        
        <!-- Main Content -->
        <main class="content">
            <div class="welcome-banner">
                <h1>🔥 CHÀO MỪNG ĐẾN VỚI NINI STORE</h1>
                <p>Nơi cung cấp code Free Fire uy tín - chất lượng - giá tốt nhất</p>
                <div class="user-stats">
                    <span>💰 Điểm: <?php echo number_format($user['points']); ?></span>
                    <span>👑 VIP: <?php echo $user['vip_level']; ?></span>
                </div>
            </div>
            
            <h2 class="section-title">📦 DANH SÁCH CODE</h2>
            
            <?php if ($codes->num_rows > 0): ?>
                <div class="code-grid">
                    <?php while($row = $codes->fetch_assoc()): ?>
                    <div class="code-card">
                        <div class="code-header">
                            <h3><?php echo htmlspecialchars($row['code_name']); ?></h3>
                            <span class="code-category"><?php echo htmlspecialchars($row['category']); ?></span>
                        </div>
                        <div class="code-body">
                            <div class="code-info">
                                <span class="code-price">💰 <?php echo number_format($row['price']); ?>đ</span>
                                <span class="code-stock">📦 Còn: <?php echo $row['stock']; ?> code</span>
                            </div>
                            <button onclick="buyCode(<?php echo $row['id']; ?>, <?php echo $row['price']; ?>)" class="buy-btn">
                                🛒 Mua ngay
                            </button>
                        </div>
                    </div>
                    <?php endwhile; ?>
                </div>
            <?php else: ?>
                <div class="empty-state">
                    <p>😅 Chưa có code nào. Hãy quay lại sau!</p>
                </div>
            <?php endif; ?>
        </main>
    </div>
    
    <script>
    function buyCode(id, price) {
        if (confirm('Bạn có chắc muốn mua code này với giá ' + price.toLocaleString() + 'đ?')) {
            window.location.href = 'buy.php?id=' + id;
        }
    }
    </script>
</body>
</html>

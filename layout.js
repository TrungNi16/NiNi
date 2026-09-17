// ===== BẢO VỆ TRANG =====
(function() {
    var user = localStorage.getItem('currentUser');
    if (!user) {
        document.documentElement.style.display = 'none';
        alert('⚠️ Vui lòng đăng nhập trước!');
        window.location.href = 'index.html';
    }
})();

// ===== HIỂN THỊ USERNAME =====
document.addEventListener('DOMContentLoaded', function() {
    var user = localStorage.getItem('currentUser') || 'Khách';
    var el = document.getElementById('usernameDisplay');
    if (el) el.textContent = user;
});

// ... (phần còn lại giữ nguyên)

// ===== ĐĂNG XUẤT =====
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        // Chỉ xóa phiên, KHÔNG xóa thông tin đã lưu
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
        window.location.href = 'index.html';
    }
}

// ==========================================
// NINI STORE - LAYOUT CHUNG
// ==========================================

// ===== BẢO VỆ TRANG =====
(function() {
    var user = localStorage.getItem('currentUser');
    var token = localStorage.getItem('sessionToken');
    
    if (!user || !token) {
        document.documentElement.style.display = 'none';
        alert('⚠️ Vui lòng đăng nhập trước!');
        window.location.href = 'index.html';
    }
})();

// ===== HIỂN THỊ USERNAME + SỐ DƯ =====
document.addEventListener('DOMContentLoaded', function() {
    var user = localStorage.getItem('currentUser') || 'Khách';
    
    // Hiển thị username
    var el = document.getElementById('usernameDisplay');
    if (el) el.textContent = user;

    // Hiển thị số dư từ Firebase
    var balanceEl = document.getElementById('balanceDisplay');
    if (balanceEl && typeof getUserBalance === 'function') {
        balanceEl.textContent = '💰 Đang tải...';
        
        getUserBalance(user).then(function(balance) {
            balanceEl.textContent = '💰 ' + balance.toLocaleString('vi-VN') + 'đ';
        }).catch(function(err) {
            console.error('Lỗi lấy số dư:', err);
            balanceEl.textContent = '💰 0đ';
        });
    }
});

// ===== CẬP NHẬT SỐ DƯ REAL-TIME =====
function listenBalanceChanges() {
    var user = localStorage.getItem('currentUser');
    if (!user || typeof db === 'undefined') return;

    db.ref('users/' + user + '/balance').on('value', function(snapshot) {
        var balance = snapshot.val() || 0;
        var balanceEl = document.getElementById('balanceDisplay');
        if (balanceEl) {
            balanceEl.textContent = '💰 ' + balance.toLocaleString('vi-VN') + 'đ';
        }
    });
}

// ===== TOGGLE SIDEBAR =====
function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var content = document.getElementById('content');
    var overlay = document.getElementById('overlay');
    var isMobile = window.innerWidth <= 768;

    if (isMobile) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('show');
    } else {
        sidebar.classList.toggle('hidden');
        if (content) content.classList.toggle('full');
    }
}

function closeMobileSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('show');
}

// ===== TOGGLE SUB-MENU =====
function toggleSubMenu(element) {
    if (event) event.preventDefault();
    
    var parentLi = element.closest('li');
    if (!parentLi) return;
    
    var subMenu = parentLi.querySelector('.sub-menu');
    var arrow = parentLi.querySelector('.menu-arrow');
    
    if (subMenu) {
        subMenu.classList.toggle('open');
        if (arrow) arrow.classList.toggle('open');
    }
}

// ===== XỬ LÝ MENU KHI CLICK =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sidebar-menu li > a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            var parentLi = this.closest('li');
            if (parentLi && parentLi.classList.contains('has-sub')) {
                e.preventDefault();
                toggleSubMenu(this);
                return;
            }
            
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) closeMobileSidebar();
    });

    listenBalanceChanges();
});

// ===== ĐĂNG XUẤT =====
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        var user = localStorage.getItem('currentUser');
        
        if (typeof clearSessionFromCloud === 'function' && user) {
            clearSessionFromCloud(user).catch(function() {});
        }
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('loginTime');
        
        window.location.href = 'index.html';
    }
}

// ===== POPUP =====
function showPopup(icon, title, message) {
    var popupIcon = document.getElementById('popupIcon');
    var popupTitle = document.getElementById('popupTitle');
    var popupMessage = document.getElementById('popupMessage');
    var popupOverlay = document.getElementById('popupOverlay');
    if (!popupOverlay) return;
    if (popupIcon) popupIcon.textContent = icon;
    if (popupTitle) popupTitle.textContent = title;
    if (popupMessage) popupMessage.textContent = message;
    popupOverlay.classList.add('show');
}

function closePopup() {
    var popupOverlay = document.getElementById('popupOverlay');
    if (popupOverlay) popupOverlay.classList.remove('show');
}

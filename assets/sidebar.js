// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('overlay');
    const main = document.getElementById('mainContent');
    
    if (window.innerWidth <= 768) {
        // Mobile: trượt sidebar
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    } else {
        // Desktop: ẩn/hiện sidebar
        sidebar.classList.toggle('hidden');
        toggle.classList.toggle('active');
        if (main) {
            main.classList.toggle('full');
        }
    }
}

// Toggle submenu
function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    if (submenu) {
        submenu.classList.toggle('open');
        element.parentElement.classList.toggle('open');
    }
}

// Đóng sidebar khi click overlay (mobile)
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            document.getElementById('sidebar').classList.remove('show');
            this.classList.remove('show');
        });
    }
});

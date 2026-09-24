// ==========================================
// NINI STORE - FIREBASE SYNC
// ==========================================

// ===== CẤU HÌNH FIREBASE =====
var firebaseConfig = {
    apiKey: "AIzaSyCghsuyQOhK6EYM5tyMVeMyMORE-yy79UE",
    authDomain: "trungni.firebaseapp.com",
    databaseURL: "https://trungni-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "trungni",
    storageBucket: "trungni.firebasestorage.app",
    messagingSenderId: "195760563004",
    appId: "1:195760563004:web:f013e32bdc4f9239a23439"
};

// ===== KHỞI TẠO FIREBASE =====
var db;

try {
    if (typeof firebase === 'undefined') {
        console.error('❌ LỖI: Firebase SDK chưa được load!');
    } else {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.database();
        console.log('✅ Firebase đã khởi tạo thành công!');
    }
} catch (error) {
    console.error('❌ LỖI khởi tạo Firebase:', error);
}

// ==========================================
// USER FUNCTIONS
// ==========================================

// ===== 1. ĐĂNG KÝ USER LÊN CLOUD =====
function registerUserToCloud(username, password) {
    return db.ref('users/' + username).set({
        username: username,
        password: password,
        balance: 100000,
        vipLevel: 0,
        createdAt: Date.now(),
        lastLogin: Date.now()
    });
}

// ===== 2. LẤY USER TỪ CLOUD =====
function getUserFromCloud(username) {
    return db.ref('users/' + username).once('value').then(function(snapshot) {
        return snapshot.val();
    });
}

// ===== 3. KIỂM TRA USER TỒN TẠI =====
function checkUserExists(username) {
    return db.ref('users/' + username).once('value').then(function(snapshot) {
        return snapshot.exists();
    });
}

// ===== 4. CẬP NHẬT LẦN ĐĂNG NHẬP CUỐI =====
function updateLastLogin(username) {
    return db.ref('users/' + username + '/lastLogin').set(Date.now());
}

// ===== 5. LƯU PHIÊN ĐĂNG NHẬP LÊN CLOUD =====
function saveSessionToCloud(username, token) {
    return db.ref('sessions/' + username).set({
        username: username,
        token: token,
        loginTime: Date.now(),
        device: navigator.userAgent,
        platform: navigator.platform
    });
}

// ===== 6. LẤY PHIÊN ĐĂNG NHẬP TỪ CLOUD =====
function getSessionFromCloud(username) {
    return db.ref('sessions/' + username).once('value').then(function(snapshot) {
        return snapshot.val();
    });
}

// ===== 7. XÓA PHIÊN ĐĂNG NHẬP =====
function clearSessionFromCloud(username) {
    return db.ref('sessions/' + username).remove();
}

// ===== 8. LƯU LỊCH SỬ ĐĂNG NHẬP =====
function saveLoginHistory(username, success) {
    var logRef = db.ref('loginHistory/' + username).push();
    return logRef.set({
        time: Date.now(),
        success: success,
        device: navigator.userAgent,
        platform: navigator.platform
    });
}

// ===== 9. TẠO TOKEN NGẪU NHIÊN =====
function generateToken() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15) +
           Date.now().toString(36);
}

// ===== 10. LẤY SỐ DƯ USER =====
function getUserBalance(username) {
    return db.ref('users/' + username + '/balance').once('value').then(function(snapshot) {
        var balance = snapshot.val();
        return balance !== null ? balance : 0;
    });
}

// ===== 11. CẬP NHẬT SỐ DƯ USER =====
function updateUserBalance(username, newBalance) {
    return db.ref('users/' + username + '/balance').set(newBalance);
}

// ===== 12. CỘNG TIỀN CHO USER =====
function addUserBalance(username, amount) {
    return db.ref('users/' + username + '/balance').transaction(function(current) {
        return (current || 0) + amount;
    });
}

// ===== 13. TRỪ TIỀN USER =====
function subtractUserBalance(username, amount) {
    return db.ref('users/' + username + '/balance').transaction(function(current) {
        var balance = current || 0;
        if (balance < amount) return;
        return balance - amount;
    });
}

// ===== 14. LẤY THÔNG TIN USER ĐẦY ĐỦ =====
function getUserInfo(username) {
    return db.ref('users/' + username).once('value').then(function(snapshot) {
        return snapshot.val();
    });
}

// ===== 15. CẬP NHẬT VIP LEVEL =====
function updateUserVip(username, level) {
    return db.ref('users/' + username + '/vipLevel').set(level);
}

// ===== 16. LƯU LỊCH SỬ MUA HÀNG =====
function savePurchaseToCloud(username, itemName, price) {
    var purchaseRef = db.ref('purchases/' + username).push();
    return purchaseRef.set({
        itemName: itemName,
        price: price,
        time: Date.now()
    });
}

// ===== 17. LẤY LỊCH SỬ MUA HÀNG =====
function getPurchaseHistory(username) {
    return db.ref('purchases/' + username).once('value').then(function(snapshot) {
        var data = snapshot.val();
        if (!data) return [];
        return Object.values(data).sort(function(a, b) {
            return b.time - a.time;
        });
    });
}

// ===== 18. LƯU LỊCH SỬ NHIỆM VỤ =====
function saveTaskToCloud(username, taskName, points) {
    var taskRef = db.ref('tasks/' + username).push();
    return taskRef.set({
        taskName: taskName,
        points: points,
        time: Date.now()
    });
}

// ===== 19. LẤY LỊCH SỬ NHIỆM VỤ =====
function getTaskHistory(username) {
    return db.ref('tasks/' + username).once('value').then(function(snapshot) {
        var data = snapshot.val();
        if (!data) return [];
        return Object.values(data).sort(function(a, b) {
            return b.time - a.time;
        });
    });
}

// ===== 20. LƯU LỊCH SỬ VƯỢT LINK =====
function saveLinkHistoryToCloud(username, service, link, points, status) {
    var linkRef = db.ref('links/' + username).push();
    return linkRef.set({
        service: service,
        link: link,
        points: points,
        status: status || 'pending',
        time: Date.now()
    });
}

// ===== 21. LẤY LỊCH SỬ VƯỢT LINK =====
function getLinkHistoryFromCloud(username) {
    return db.ref('links/' + username).once('value').then(function(snapshot) {
        var data = snapshot.val();
        if (!data) return [];
        return Object.values(data).sort(function(a, b) {
            return b.time - a.time;
        });
    });
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

// ===== 22. LẤY TẤT CẢ LINK =====
function getAllPendingLinks() {
    console.log('🔍 getAllPendingLinks() được gọi');
    
    return db.ref('links').once('value').then(function(snapshot) {
        var data = snapshot.val();
        console.log('📦 Dữ liệu links:', data);
        
        if (!data) {
            console.log('⚠️ Không có link nào');
            return [];
        }
        
        var allLinks = [];
        Object.keys(data).forEach(function(username) {
            var userLinks = data[username];
            if (userLinks && typeof userLinks === 'object') {
                Object.keys(userLinks).forEach(function(key) {
                    var link = userLinks[key];
                    if (link && typeof link === 'object') {
                        link.id = key;
                        link.username = username;
                        allLinks.push(link);
                    }
                });
            }
        });
        
        console.log('✅ Tổng số link:', allLinks.length);
        
        return allLinks.sort(function(a, b) {
            return (b.time || 0) - (a.time || 0);
        });
    }).catch(function(err) {
        console.error('❌ Lỗi getAllPendingLinks:', err);
        return [];
    });
}

// ===== 23. LẤY LINK THEO TRẠNG THÁI =====
function getLinksByStatus(status) {
    return getAllPendingLinks().then(function(links) {
        if (status === 'all') return links;
        return links.filter(function(link) {
            return link.status === status;
        });
    });
}

// ===== 24. DUYỆT LINK =====
function approveLink(username, linkId) {
    return db.ref('links/' + username + '/' + linkId).once('value').then(function(snapshot) {
        var link = snapshot.val();
        if (!link) throw new Error('Link không tồn tại');
        if (link.status === 'done') throw new Error('Link đã được duyệt rồi');
        
        return db.ref('links/' + username + '/' + linkId + '/status').set('done')
            .then(function() {
                return addUserBalance(username, link.points);
            })
            .then(function() {
                console.log('✅ Đã duyệt link và cộng', link.points, 'đ cho', username);
                return true;
            });
    });
}

// ===== 25. TỪ CHỐI LINK =====
function rejectLink(username, linkId) {
    return db.ref('links/' + username + '/' + linkId + '/status').set('rejected')
        .then(function() {
            console.log('❌ Đã từ chối link của', username);
            return true;
        });
}

// ===== 26. XÓA LINK =====
function deleteLink(username, linkId) {
    return db.ref('links/' + username + '/' + linkId).remove()
        .then(function() {
            console.log('🗑️ Đã xóa link');
            return true;
        });
}

// ===== 27. KIỂM TRA ADMIN =====
function checkAdmin(username) {
    var adminList = ['trungni16', 'admin'];
    
    return db.ref('users/' + username + '/isAdmin').once('value').then(function(snapshot) {
        var isAdmin = snapshot.val();
        return isAdmin === true || adminList.indexOf(username) !== -1;
    }).catch(function() {
        return adminList.indexOf(username) !== -1;
    });
}

// ===== 28. ĐẾM SỐ LINK PENDING =====
function countPendingLinks() {
    return getAllPendingLinks().then(function(links) {
        return links.filter(function(l) { return l.status === 'pending'; }).length;
    });
}

// ===== 29. LẤY THÔNG TIN USER (Admin) =====
function getAllUsers() {
    console.log('🔍 getAllUsers() được gọi');
    
    return db.ref('users').once('value').then(function(snapshot) {
        var data = snapshot.val();
        console.log('📦 Dữ liệu users:', data);
        
        if (!data) {
            console.log('⚠️ Không có user nào');
            return [];
        }
        
        var users = Object.values(data);
        console.log('✅ Tổng số user:', users.length);
        
        return users.sort(function(a, b) {
            return (b.createdAt || 0) - (a.createdAt || 0);
        });
    }).catch(function(err) {
        console.error('❌ Lỗi getAllUsers:', err);
        return [];
    });
}

// ===== 30. CẬP NHẬT QUYỀN ADMIN =====
function setAdmin(username, isAdmin) {
    return db.ref('users/' + username + '/isAdmin').set(isAdmin);
}

console.log('✅ File firebase.js đã load xong!');

// ==========================================
// NINI STORE - FIREBASE SYNC
// ==========================================

// Firebase SDK (Compat version - dễ dùng)
// Đã nhúng qua CDN trong HTML

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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
var db = firebase.database();

// ==========================================
// CÁC HÀM XỬ LÝ USER
// ==========================================

// ===== 1. ĐĂNG KÝ USER LÊN CLOUD =====
function registerUserToCloud(username, password) {
    return db.ref('users/' + username).set({
        username: username,
        password: password,
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

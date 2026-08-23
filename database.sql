-- Tạo database
CREATE DATABASE IF NOT EXISTS nini_store;
USE nini_store;

-- Bảng người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    vip_level INT DEFAULT 0,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng mã code
CREATE TABLE codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_name VARCHAR(100) NOT NULL,
    code_value VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lịch sử mua hàng
CREATE TABLE purchase_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    code_id INT,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (code_id) REFERENCES codes(id)
);

-- Thêm dữ liệu mẫu cho bảng codes
INSERT INTO codes (code_name, code_value, price, stock, category) VALUES
('Code Ughearna Redesem 4H', 'UGHEARN4H', 50000, 10, 'Code Free Fire'),
('Code Vimos 1 Day', 'VIMOS1D', 30000, 15, 'Code Free Fire'),
('Code Vipplayer 1 Ngày', 'VIPPL1N', 20000, 20, 'Code Free Fire'),
('Code Vipplayer 2 Ngày', 'VIPPL2N', 35000, 12, 'Code Free Fire'),
('Code Uuphone 7 Ngày', 'UUPH7N', 100000, 8, 'Code Free Fire'),
('Code Uuphone 15 Ngày', 'UUPH15N', 150000, 5, 'Code Free Fire'),
('App Mod Skin', 'APPMODSK', 80000, 7, 'App Mod');

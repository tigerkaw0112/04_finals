-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2025 at 07:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookshop_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `author` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 10,
  `cover_image` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `price`, `stock`, `cover_image`, `description`, `category_id`) VALUES
(1, 'แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์', 'J.K. Rowling', 425.00, 79, 'https://upload.wikimedia.org/wikipedia/th/d/d7/%E0%B9%83%E0%B8%9A%E0%B8%9B%E0%B8%B4%E0%B8%94%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%A2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87_%E0%B9%81%E0%B8%AE%E0%B8%A3%E0%B9%8C%E0%B8%A3%E0%B8%B5%E0%B9%88_%E0%B8%9E%E0%B8%AD%E0%B8%95%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%B2%E0%B8%AD%E0%B8%B2%E0%B8%96%E0%B8%A3%E0%B8%A3%E0%B8%9E%E0%B9%8C_.jpg', 'ฉบับครบรอบ 20 ปี ปกแข็ง', 1),
(2, 'One Piece เล่ม 110', 'Eiichiro Oda', 80.00, 350, 'https://storage.naiin.com/system/application/bookstore/resource/product/202412/632863/1000278234_front_XXL.jpg', 'เล่มล่าสุด เอ็กก์เฮดมาแล้ว!', 2),
(3, 'Solo Leveling เล่ม 10 (จบ)', 'Chugong', 159.00, 498, 'https://www.phoenixnext.com/media/nextgenimages/media/catalog/product/cache/0a2cd843897b8bcd4a0dda42cebedd04/_/l/_ln_solo_leveling_vol10_jacket_1_.webp', 'เล่มจบพร้อมกล่อง+โปสเตอร์', 3),
(4, 'Jujutsu Kaisen เล่ม 26', 'Gege Akutami', 90.00, 280, 'https://cdn-local.mebmarket.com/meb/server1/305077/Thumbnail/book_detail_large.gif?2', 'เล่มล่าสุด 2025', 2),
(5, 'ดุณห์ Dune เล่ม 1', 'Frank Herbert', 595.00, 60, 'https://www.biblio-store.com/wp-content/uploads/2022/10/DUNE_COVER-RGB_DUNE1_front-1-600x797-1.jpg', 'นิยายไซไฟระดับตำนาน', 1),
(6, 'Sapiens ประวัติย่อมนุษยชาติ', 'Yuval Noah Harari', 450.00, 149, 'https://upload.wikimedia.org/wikipedia/th/b/b8/Sapiens_A_Brief_History_of_Humankind_Thai_Cover.jpg', 'เปลี่ยนมุมมองโลก', 5),
(7, 'Atomic Habits', 'James Clear', 395.00, 197, 'https://storage.naiin.com/system/application/bookstore/resource/product/202007/508699/1000233967_front_XXL.jpg', 'เปลี่ยนนิสัยเล็ก ๆ ให้ชีวิตดีขึ้น', 8),
(8, 'คู่มือเที่ยวญี่ปุ่น 2025-2026', 'ทีมงาน Readme', 399.00, 85, 'https://img.th.my-best.com/product_images/e314f5f03e586df9266323c7a0aec422.png?ixlib=rails-4.3.1&q=70&lossless=0&w=800&h=800&fit=clip&s=7d4f462525309e77ca9478e3f5249656', 'อัปเดตเต็มรูปแบบ', 4),
(9, 'กรุงศรีอยุธยา มรดกโลกที่สาบสูญ', 'ชาติชาย มุกสุวรรณ', 650.00, 43, 'https://inwfile.com/s-gd/5ndwn2.jpg', 'ภาพสีเต็มเล่ม', 6),
(10, 'Chainsaw Man เล่ม 19', 'Tatsuki Fujimoto', 90.00, 199, 'https://cdn-local.mebmarket.com/meb/server1/347882/Thumbnail/book_detail_large.gif?2', 'Part 2 เดือดต่อเนื่อง', 2);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'นิยาย'),
(2, 'มังงะ'),
(3, 'มังฮวา'),
(4, 'ท่องเที่ยว'),
(5, 'สารคดี'),
(6, 'ประวัติศาสตร์'),
(7, 'ธุรกิจ'),
(8, 'พัฒนาตนเอง'),
(9, 'เทคโนโลยี');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `shipping_address` text NOT NULL,
  `status` enum('pending','paid','shipped') DEFAULT 'paid',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `shipping_address`, `status`, `created_at`) VALUES
(1, 1, 1780.00, '121dadasdsasd', 'paid', '2025-12-03 11:06:35'),
(2, 1, 3290.00, '-', 'paid', '2025-12-04 08:03:31'),
(3, 1, 280.00, '-', 'paid', '2025-12-04 08:12:08'),
(4, 1, 390.00, '-', 'paid', '2025-12-04 08:21:35'),
(5, 1, 1560.00, '-', 'paid', '2025-12-04 08:30:20'),
(6, 1, 3320.00, '-', 'paid', '2025-12-04 09:26:32'),
(7, 1, 648.00, '-', 'paid', '2025-12-04 17:38:06'),
(8, 1, 979.00, '-', 'paid', '2025-12-04 17:56:01'),
(9, 1, 2892.00, '-', 'paid', '2025-12-04 18:04:57'),
(10, 1, 1244.00, '-', 'paid', '2025-12-04 18:07:13');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `book_id`, `quantity`, `price`) VALUES
(1, 1, 5, 1, 1500.00),
(2, 1, 4, 1, 280.00),
(3, 2, 5, 1, 1500.00),
(4, 2, 4, 5, 280.00),
(5, 2, 3, 1, 390.00),
(6, 3, 4, 1, 280.00),
(7, 4, 3, 1, 390.00),
(8, 5, 3, 4, 390.00),
(9, 6, 6, 1, 1450.00),
(10, 6, 4, 1, 280.00),
(11, 6, 3, 1, 390.00),
(12, 6, 2, 1, 1200.00),
(13, 7, 10, 1, 90.00),
(14, 7, 8, 1, 399.00),
(15, 7, 3, 1, 159.00),
(16, 8, 7, 1, 395.00),
(17, 8, 3, 1, 159.00),
(18, 8, 1, 1, 425.00),
(19, 9, 8, 3, 399.00),
(20, 9, 9, 2, 650.00),
(21, 9, 7, 1, 395.00),
(22, 10, 8, 1, 399.00),
(23, 10, 7, 1, 395.00),
(24, 10, 6, 1, 450.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`) VALUES
(1, 'admin', '123456', 'admin@book.com', 'admin'),
(2, 'reader', '123456', 'reader@book.com', 'user'),
(3, '12346', '1232434241', 'desadasdsasd@dsadasdd', 'user'),
(4, 'bookshop', '123456', 'bookwe@gmail.com', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

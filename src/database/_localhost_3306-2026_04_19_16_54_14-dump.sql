-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: e_commerce_pra_uts_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order_products`
--

DROP TABLE IF EXISTS `order_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` int(11) NOT NULL,
  `id_store_product` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_Products_orders_id_fk` (`id_order`),
  KEY `order_Products_store_products_id_fk` (`id_store_product`),
  CONSTRAINT `order_Products_orders_id_fk` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_Products_store_products_id_fk` FOREIGN KEY (`id_store_product`) REFERENCES `store_products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_products`
--

LOCK TABLES `order_products` WRITE;
/*!40000 ALTER TABLE `order_products` DISABLE KEYS */;
INSERT INTO `order_products` VALUES (1,1,7,10000,10),(2,1,8,110,10),(3,2,2,899000,1),(4,3,4,889000,1),(5,3,6,299000,3),(6,3,5,275000,5);
/*!40000 ALTER TABLE `order_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `status` enum('pending','proses','dikirim','selesai') NOT NULL,
  `total_price` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Orders_users_id_fk` (`id_user`),
  CONSTRAINT `Orders_users_id_fk` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2026-04-18 00:48:23','pending',210),(2,2,'2026-04-18 10:50:05','proses',899000),(3,3,'2026-04-18 23:50:43','dikirim',1463000);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'SwiftCool Pro Cooling Pad','Cooling pad ultra-tipis dengan desain alumunium dan kipas senyap. Dirancang khusus untuk menjaga suhu laptop performa tinggi tetap stabil saat heavy coding atau gaming.'),(2,'Eclipse Mechanical Keyboard (Dark Edition)','Keyboard mekanikal dengan switch taktil dan backlight RGB yang dapat dikustomisasi. Optimal untuk kenyamanan mengetik kode dalam durasi lama di lingkungan minim cahaya.'),(3,'NodeSense ESP32 Starter Kit','Paket lengkap pengembangan IoT berbasis ESP32. Dilengkapi sensor ultrasonik dan modul Wi-Fi untuk proyek biofeedback maupun otomatisasi rumah pintar.'),(4,'NPScripts Premium Library','Kumpulan modul siap pakai untuk Node-Program. Mempercepat alur logika visual Anda dengan fungsi-fungsi backend yang sudah teroptimasi secara performa.'),(5,'\"Low Latency\" Oversized Hoodie','Hoodie katun premium dengan grafis minimalis bertema struktur data. Nyaman dipakai untuk sesi debugging hingga larut malam.'),(6,'Zenith Ultra-Wide Monitor 34\"','Monitor melengkung dengan rasio 21:9 dan akurasi warna 99% sRGB. Memberikan ruang pandang luas untuk multitasking antara editor kode dan dokumentasi.'),(7,'Vortex Air-Lift Standing Desk','Meja kerja elektrik dengan pengaturan ketinggian presisi. Membantu menjaga postur tubuh tetap ergonomis selama jam kerja yang panjang.'),(8,'Binary Stream Noise-Cancelling Headphones','Headphone nirkabel dengan fitur ANC tingkat lanjut. Menghilangkan distraksi suara sekitar agar fokus maksimal saat melakukan deep work.'),(9,'Titanium Keycap Set (Cyberpunk Edition)','Set keycap berbahan PBT doubleshot dengan font futuristik. Tahan lama dan memberikan estetika unik pada setup keyboard mekanikal Anda.'),(10,'CoreDock 12-in-1 USB-C Hub','Stasiun docking serbaguna dengan dukungan dual 4K monitor dan transfer data kecepatan tinggi. Solusi ringkas untuk manajemen kabel yang rapi.'),(11,'GhostWire Braided USB-C Cable','Kabel pengisian daya dan data dengan pelindung serat nilon yang kuat. Tidak mudah kusut dan mendukung pengisian cepat hingga 100W.');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_products`
--

DROP TABLE IF EXISTS `store_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_store` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Store_Products_products_id_fk` (`id_product`),
  KEY `Store_Products_stores_id_fk` (`id_store`),
  CONSTRAINT `Store_Products_products_id_fk` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`),
  CONSTRAINT `Store_Products_stores_id_fk` FOREIGN KEY (`id_store`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_products`
--

LOCK TABLES `store_products` WRITE;
/*!40000 ALTER TABLE `store_products` DISABLE KEYS */;
INSERT INTO `store_products` VALUES (1,1,1,349000,25),(2,1,2,899000,17),(3,1,4,149000,34),(4,2,2,889000,50),(5,2,3,275000,43),(6,2,5,299000,36),(7,3,1,100,9999),(8,3,2,111,9999),(9,3,3,120,9999),(10,3,4,130,9999),(11,3,5,140,9999),(12,1,3,285000,15),(13,1,6,7500000,5),(14,1,7,4200000,8),(15,2,1,355000,20),(16,2,4,155000,40),(17,2,10,650000,12),(18,3,6,150,9999),(19,3,7,160,9999),(20,3,8,170,9999),(24,4,1,345000,30),(25,4,2,910000,15),(26,4,6,7250000,10),(27,4,8,2450000,22),(28,4,11,85000,100),(29,5,3,280000,25),(30,5,5,310000,18),(31,5,9,450000,14),(32,5,10,675000,20),(33,5,11,89000,50);
/*!40000 ALTER TABLE `store_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'Let\'s Go Shop','jln. Dimana Saja'),(2,'VSD STORE','jln. Rahasia'),(3,'RYP','jln. Di Atas Bumi'),(4,'Sinar Jaya Abadi','jln. Matahari Terbit'),(5,'Toko Makmur','jln. Keadilan Raya');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rizky Saputra Pakpahan','Galang','rizkysaputrapakpahan@gmail.com'),(2,'Jhody Parsaoran Sitorus','Palembang','jhodysitorus@gmail.com'),(3,'Christion De Midro Nainggolan','Medan','christiannainggolan@gmail.com'),(4,'Budi Santoso','Jakarta','budisantoso88@gmail.com'),(5,'Siti Aminah','Bandung','siti.aminah@yahoo.com'),(6,'Andi Wijaya','Surabaya','andiwijaya@outlook.com'),(7,'Dewi Lestari','Semarang','dewilestari.p@gmail.com'),(8,'Rizky Ramadhan','Yogyakarta','rizky.ramadhan@gmail.com'),(9,'Putu Gede','Denpasar','putugede_bali@gmail.com'),(10,'Maya Kartika','Malang','mayakartika@hotmail.com'),(11,'Fajar Nugraha','Medan','fajarnugraha92@gmail.com'),(12,'Lestari Wahyuni','Makassar','lestari.wahyuni@yahoo.co.id'),(13,'Aditya Pratama','Palembang','adityapratama@gmail.com'),(14,'Nadia Safira','Balikpapan','nadiasafira@outlook.com'),(15,'Hendra Kurniawan','Pontianak','hendra.kurnia@gmail.com'),(16,'Fitri Handayani','Manado','fitri.handayani@yahoo.com'),(17,'Dimas Setiawan','Solo','dimas_setiawan@gmail.com'),(18,'Ayu Tingting','Depok','ayutingting@gmail.com'),(19,'Eko Prasetyo','Banjarmasin','ekoprasetyo.bjm@gmail.com'),(20,'Rina Melati','Pekanbaru','rina.melati@yahoo.com'),(21,'Agus Susanto','Lampung','agussusanto85@gmail.com'),(22,'Indah Permatasari','Bogor','indah_permatasari@outlook.com'),(23,'Kevin Sanjaya','Tangerang','kevinsanjaya@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-19 16:54:14

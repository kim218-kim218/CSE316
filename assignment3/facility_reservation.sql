-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: localhost    Database: facility_reservation
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `facility_name` varchar(255) NOT NULL,
  `facility_description` text,
  `image_source` varchar(255) DEFAULT NULL,
  `available_days` varchar(255) DEFAULT NULL,
  `min_capacity` int DEFAULT NULL,
  `max_capacity` int DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `only_for_suny` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'Gym','A place used for physical activity','https://res.cloudinary.com/dkeneeift/image/upload/v1730882084/gym_ryvqeu.jpg','Mon, Tue, Wed, Thu, Fri, Sat, Sun',1,5,'A101',0),(2,'Auditorium','A place for large events','https://res.cloudinary.com/dkeneeift/image/upload/v1730882083/auditorium_p5emxq.jpg','Mon, Tue, Wed, Thu',10,40,'A234',0),(3,'Swimming Pool','A place for physical activity','https://res.cloudinary.com/dkeneeift/image/upload/v1730882084/pool_gul8xt.jpg','Sun, Sat',1,8,'B403',0),(4,'Seminar Room','A place for large meetings','https://res.cloudinary.com/dkeneeift/image/upload/v1730882085/seminar_waxkxo.jpg','Mon, Wed, Fri',10,30,'B253',0),(5,'Conference Room','A place for small but important meetings','https://res.cloudinary.com/dkeneeift/image/upload/v1730882084/conference_jcy8fo.jpg','Mon, Tue, Wed, Thu, Fri',1,10,'C1033',1),(6,'Library','A quiet place','https://res.cloudinary.com/dkeneeift/image/upload/v1730882087/library_qve5vz.jpg','Mon, Tue, Wed, Thu, Fri, Sat, Sun',1,20,'A1011',1);
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation_date` date NOT NULL,
  `user_number` int NOT NULL,
  `is_suny_korea` tinyint(1) NOT NULL,
  `purpose` text,
  `reservation_name` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-09  1:54:33

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2026 at 06:06 PM
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
-- Database: `taxicap`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `UserId` int(11) NOT NULL,
  `DriverMode` int(1) NOT NULL DEFAULT 0,
  `ActiveOrder` int(11) NOT NULL DEFAULT 0,
  `UserName` varchar(255) DEFAULT NULL,
  `UserPhone` bigint(11) DEFAULT 999999,
  `UserBirthday` date DEFAULT NULL,
  `UserEmail` text DEFAULT NULL,
  `UserPassword` text DEFAULT NULL,
  `VehicleBrand` varchar(255) DEFAULT NULL,
  `VehicleModel` varchar(255) DEFAULT NULL,
  `VehicleColor` varchar(255) DEFAULT NULL,
  `VehicleNumber` varchar(255) DEFAULT NULL,
  `Wallet` int(11) DEFAULT NULL,
  `UserImage` varchar(255) DEFAULT NULL,
  `PersonalDataConsent` tinyint(1) NOT NULL DEFAULT 0,
  `AgeStatus` tinyint(4) NOT NULL DEFAULT 0,
  `AdverseStatus` tinyint(4) NOT NULL DEFAULT 0,
  `PersonalDataConsentAt` datetime DEFAULT NULL,
  `PersonalDataConsentIp` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`UserId`, `DriverMode`, `ActiveOrder`, `UserName`, `UserPhone`, `UserBirthday`, `UserEmail`, `UserPassword`, `VehicleBrand`, `VehicleModel`, `VehicleColor`, `VehicleNumber`, `Wallet`, `UserImage`, `PersonalDataConsent`, `AgeStatus`, `AdverseStatus`, `PersonalDataConsentAt`, `PersonalDataConsentIp`) VALUES
(1, 1, 0, 'Мишаня', 89397561466, NULL, 'm.romanov.biz@gmail.com1', NULL, 'Volkswagen', 'Touareg', 'Black', 'e103aa163', NULL, NULL, 0, 0, 0, NULL, NULL),
(3, 0, 0, 'Дмитрий', 999999, NULL, 'e@e.e', NULL, 'D', 'DD', 'Black', '3123', NULL, NULL, 0, 0, 0, NULL, NULL),
(4, 0, 0, 'Райан', 999999, NULL, 'defol7@yandex.ru', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL),
(5, 0, 0, 'Михаил', 89397561466, NULL, 'm.romanov.biz@gmail.com', NULL, 'Lada', 'Kalina', 'Black', 'E903TO763', NULL, NULL, 0, 0, 0, NULL, NULL),
(8, 0, 0, 'Misha', 1233215566, NULL, 'w@w.2', NULL, 'BMW', 'X5', 'Black', '112', NULL, NULL, 0, 0, 0, NULL, NULL),
(9, 0, 0, 'fsdfs', 9397561466, NULL, 'w@w.w', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL),
(10, 0, 0, 'Михаил', 9277599894, NULL, 'm.romanov.biz@gmail.com5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL),
(11, 0, 0, 'Михаил', 9899898989, NULL, 'm.romanov.biz@gmail.com323', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL),
(12, 0, 0, 'Михаил', 9999999999, NULL, 'ex@ex.ex', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL),
(13, 1, 0, 'Дмитрий', 9033093257, NULL, 'iperrogames346@gmail.com', NULL, 'KIA', 'RIO', 'Black', 'B487MP763', NULL, NULL, 0, 0, 0, NULL, NULL),
(14, 0, 0, 'Mishka', 9999999999, NULL, 'iperrogames987@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL),
(15, 0, 0, 'Тест', 9999999999, NULL, 'test@email.ru', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL),
(16, 0, 0, 'Михаил', 1112223334, NULL, '13@1.1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, '2026-10-01 17:44:07', '::1'),
(17, 1, 0, 'Михаил', 8334445566, NULL, '123@1.16', NULL, 'Lada', 'Kalina', 'Black', 'O321KP163', NULL, 'users/f592da7a3028e27a5e1213c2375a0443/7d79b631d291401bf511e1a8114c3d2d.jpg', 1, 0, 0, '2026-10-01 17:47:06', '::1');

-- --------------------------------------------------------

--
-- Table structure for table `eatproducts`
--

CREATE TABLE `eatproducts` (
  `ProductId` int(11) NOT NULL,
  `RestaurantId` int(11) NOT NULL,
  `ProductName` text NOT NULL,
  `ProductDescr` text NOT NULL,
  `ProductWeight` int(11) NOT NULL,
  `ProductPrice` int(11) NOT NULL,
  `ProductMainImage` text DEFAULT NULL,
  `ProductSecondImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ProductKkal` int(11) DEFAULT NULL,
  `ProductProtein` int(11) DEFAULT NULL,
  `PrdouctFat` int(11) DEFAULT NULL,
  `ProductCarb` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eatproducts`
--

INSERT INTO `eatproducts` (`ProductId`, `RestaurantId`, `ProductName`, `ProductDescr`, `ProductWeight`, `ProductPrice`, `ProductMainImage`, `ProductSecondImage`, `ProductKkal`, `ProductProtein`, `PrdouctFat`, `ProductCarb`) VALUES
(1, 1, 'Паста Альфредо', 'Классическая паста с кремовым соусом', 300, 450, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 1, 'Пицца: Пепперони', 'Пепперони, Сыр чеддер, Сыр сливочный, Горчица, Кетчуп', 1150, 488, '', '', 0, 0, 0, 0),
(5, 1, '1', '1', 0, 0, '/public/swiftEat/3c4494da3e0e35602a4bb303f9ab7a69.jpg', '', 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `eatrestaurants`
--

CREATE TABLE `eatrestaurants` (
  `RestaurantId` int(11) NOT NULL,
  `Email` text NOT NULL,
  `Password` text NOT NULL,
  `SessionKey` text NOT NULL,
  `RestaurantName` text NOT NULL,
  `RestaurantAddress` text NOT NULL,
  `RestaurantOwner` text NOT NULL,
  `RestaurantLogo` text NOT NULL,
  `TimeUp` text NOT NULL,
  `TimeOut` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eatrestaurants`
--

INSERT INTO `eatrestaurants` (`RestaurantId`, `Email`, `Password`, `SessionKey`, `RestaurantName`, `RestaurantAddress`, `RestaurantOwner`, `RestaurantLogo`, `TimeUp`, `TimeOut`) VALUES
(1, 'test@swift-transport.ru', '123', '123456789', 'SwiftTr-Eat', 'ул.Вокзальная д.404', 'SwiftTr.Inc', '/logo/colored-short-logo.svg', '09:30', '22:00');

-- --------------------------------------------------------

--
-- Table structure for table `eatstats`
--

CREATE TABLE `eatstats` (
  `id` int(11) NOT NULL,
  `clickCounts` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eatstats`
--

INSERT INTO `eatstats` (`id`, `clickCounts`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `eatusers`
--

CREATE TABLE `eatusers` (
  `UserId` int(11) NOT NULL,
  `UserEmail` text DEFAULT NULL,
  `UserPassword` text DEFAULT NULL,
  `UserSessionId` text DEFAULT NULL,
  `UserName` text DEFAULT NULL,
  `UserPhone` int(11) DEFAULT NULL,
  `UserOrders` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`UserOrders`)),
  `UserCart` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`UserCart`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customerPhone` bigint(20) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `driverName` varchar(255) DEFAULT NULL,
  `driverId` int(11) DEFAULT NULL,
  `driverPhone` bigint(20) DEFAULT NULL,
  `vehicleBrand` varchar(255) DEFAULT NULL,
  `vehicleModel` varchar(255) DEFAULT NULL,
  `vehicleColor` varchar(255) DEFAULT NULL,
  `vehicleNumber` varchar(255) DEFAULT NULL,
  `orderStatus` varchar(255) DEFAULT NULL,
  `customerName` varchar(255) DEFAULT NULL,
  `addressFrom` varchar(255) DEFAULT NULL,
  `addressTo` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `paymentMethod` varchar(255) NOT NULL DEFAULT 'Наличные',
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `driverImage` varchar(255) DEFAULT NULL,
  `customerImage` varchar(255) DEFAULT NULL,
  `driverTime` int(11) DEFAULT NULL,
  `encodedWay` text DEFAULT NULL,
  `routeDistanceMeters` varchar(255) DEFAULT NULL,
  `routeDistanceKm` varchar(255) DEFAULT NULL,
  `latFrom` varchar(255) DEFAULT NULL,
  `latTo` varchar(255) DEFAULT NULL,
  `lonFrom` varchar(255) DEFAULT NULL,
  `lonTo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customerPhone`, `userId`, `driverName`, `driverId`, `driverPhone`, `vehicleBrand`, `vehicleModel`, `vehicleColor`, `vehicleNumber`, `orderStatus`, `customerName`, `addressFrom`, `addressTo`, `price`, `paymentMethod`, `date`, `driverImage`, `customerImage`, `driverTime`, `encodedWay`, `routeDistanceMeters`, `routeDistanceKm`, `latFrom`, `latTo`, `lonFrom`, `lonTo`) VALUES
(545, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CANCELED', 'Михаил', 'Советская улица 2А', '', 57, 'Наличные', '2026-06-14 20:23:57', NULL, NULL, NULL, 'itjyfBk_gdaBza@mE|UkB|_@cBzOQtDOhTHEnQ', '0', '0', NULL, NULL, NULL, NULL),
(548, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CANCELED', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 21:16:56', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '0', '0', NULL, NULL, NULL, NULL),
(549, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 21:55:09', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '0', '0', NULL, NULL, NULL, NULL),
(550, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 21:58:13', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '0', '0', NULL, NULL, NULL, NULL),
(551, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 22:09:49', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '0', '0', NULL, NULL, NULL, NULL),
(552, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 22:12:11', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '0', '0', NULL, NULL, NULL, NULL),
(553, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 22:22:47', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(554, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 22:25:37', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(555, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 22:26:59', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(556, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 144, 'Наличные', '2026-06-14 22:28:16', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '2207', '2.207', NULL, NULL, NULL, NULL),
(557, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 22:32:01', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(558, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 22:33:44', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(559, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', '', 86, 'Наличные', '2026-06-14 22:38:06', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(560, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:40:55', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(561, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:43:57', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(562, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:47:08', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(563, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:49:30', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(564, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:51:25', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(565, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:52:40', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(566, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:53:58', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(567, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:55:11', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(568, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 22:56:19', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(569, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Больничная улица, 4', 144, 'Наличные', '2026-06-14 22:59:18', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '2207', '2.207', NULL, NULL, NULL, NULL),
(570, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 23:02:25', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(571, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 23:05:08', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(572, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 23:50:47', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(573, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-14 23:52:18', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', NULL, NULL, NULL, NULL),
(582, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Больничная улица, 4', 144, 'Наличные', '2026-06-15 14:04:49', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '2207', '2.207', NULL, NULL, NULL, NULL),
(583, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 21:59:30', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(584, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:12:41', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(585, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:14:56', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(586, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская 11', 86, 'Наличные', '2026-06-15 22:16:20', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(587, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:20:36', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(588, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:22:40', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(589, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:24:24', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(590, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:26:59', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(591, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:28:41', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(592, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:32:58', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(593, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:35:12', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(594, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:37:28', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(595, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:40:05', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(596, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:45:24', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(597, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:47:54', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(598, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:49:54', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(599, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:52:57', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(600, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:53:00', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(601, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Больничная улица, 4', 144, 'Наличные', '2026-06-15 22:54:11', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '2207', '2.207', '54.43', '54.44', '51.46', '51.51'),
(602, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Больничная улица, 4', 144, 'Наличные', '2026-06-15 22:55:23', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '2207', '2.207', '54.43', '54.44', '51.46', '51.51'),
(603, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 22:59:15', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(604, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:01:13', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(605, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:06:45', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(606, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:10:16', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(607, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:11:05', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(608, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:14:40', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(609, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:21:00', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(610, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:28:13', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(611, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:50:22', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(612, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-15 23:59:28', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(613, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 07:07:57', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(614, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 07:13:53', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(615, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 07:21:29', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(616, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 07:27:40', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(617, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 07:34:53', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(618, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 07:41:34', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(619, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 07:43:16', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(620, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 08:00:42', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(621, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 08:04:34', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(622, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 08:21:08', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(623, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 08:24:50', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(624, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 08:29:06', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(625, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 08:33:59', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(626, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'completed', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 08:34:11', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(627, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 08:34:27', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(628, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 09:06:39', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(629, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-06-16 09:17:22', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(630, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 02:19:02', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(631, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'e903to63', 'complete', 'Дмитрий', 'Советская улица 2А', 'Советская улица, 11', 57, 'Наличные', '2026-06-17 02:19:42', NULL, NULL, NULL, 'itjyfBk_gdaBza@mE|UkB|_@cBzOQtDOhTHEnQ', '259', '0.259', '54.43', '54.44', '51.46', '51.51'),
(632, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'e903to63', 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 02:20:32', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(633, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 04:29:31', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(634, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 04:29:36', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(635, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 04:30:48', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(636, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 04:31:08', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(637, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 05:32:06', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(638, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 05:34:23', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(639, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'Дмитрий', 'Мичурина 23', 'Больничная улица, 4', 155, 'Наличные', '2026-06-17 05:34:31', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(640, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 05:34:46', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(641, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 05:36:46', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(642, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 05:41:16', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(643, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 05:42:03', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(644, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 05:43:57', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(645, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-06-17 05:47:31', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(646, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Карла-маркса 21', 110, 'Наличные', '2026-09-24 09:50:50', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG|HdUrAdFdFjVfBtInMxl@jAlFpLfl@vX`rA|@|ErXlrA|@hEd^zkBhaBk_Brk@ij@', '1455', '1.455', '54.43', '54.44', '51.46', '51.51'),
(647, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'Дмитрий', 'Чехова 33', 'Советская 11', 95, 'Наличные', '2026-09-24 09:52:10', NULL, NULL, NULL, 'k|_yfByj~daBuApAiiA`_AkuAzv@@jcBdBpXyAxBw[ne@uHnMa_@br@cWxe@{FpKwJ|Q|A`MfAvIbJhl@pIzh@lE`YzGxb@nB`MlFz\\fGh`@lDlHvCtc@j@nIaDUEnQ', '1101', '1.101', '54.43', '54.44', '51.46', '51.51'),
(648, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Чехова 33', 'Советская 11', 95, 'Наличные', '2026-09-24 09:52:35', NULL, NULL, NULL, 'k|_yfByj~daBuApAiiA`_AkuAzv@@jcBdBpXyAxBw[ne@uHnMa_@br@cWxe@{FpKwJ|Q|A`MfAvIbJhl@pIzh@lE`YzGxb@nB`MlFz\\fGh`@lDlHvCtc@j@nIaDUEnQ', '1101', '1.101', '54.43', '54.44', '51.46', '51.51'),
(649, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Чехова 33', 'Советская 11', 95, 'Наличные', '2026-09-24 09:56:05', NULL, NULL, NULL, 'k|_yfByj~daBuApAiiA`_AkuAzv@@jcBdBpXyAxBw[ne@uHnMa_@br@cWxe@{FpKwJ|Q|A`MfAvIbJhl@pIzh@lE`YzGxb@nB`MlFz\\fGh`@lDlHvCtc@j@nIaDUEnQ', '1101', '1.101', '54.43', '54.44', '51.46', '51.51'),
(650, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская 11', 155, 'Наличные', '2026-09-24 10:02:36', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(651, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская 11', 155, 'Наличные', '2026-09-24 10:42:26', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(652, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская 11', 155, 'Наличные', '2026-09-24 10:45:21', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(653, 9033093257, 13, 'fsdfs', 9, 9397561466, NULL, NULL, NULL, NULL, 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская 11', 155, 'Наличные', '2026-09-24 10:45:47', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(654, 9033093257, 13, 'fsdfs', 9, 9397561466, NULL, NULL, NULL, NULL, 'complete', 'Дмитрий', 'Мичурина 23', 'Вокзальная 4', 147, 'Наличные', '2026-09-24 10:47:40', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeUoDpJm@~AkMjTcBsDoG_HcA}B', '2263', '2.263', '54.43', '54.44', '51.46', '51.51'),
(655, 9033093257, 13, 'fsdfs', 9, 9397561466, NULL, NULL, NULL, NULL, 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-24 10:51:01', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(656, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-24 10:51:29', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(657, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-24 10:56:13', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(658, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-24 11:03:27', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(659, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Перевод', '2026-09-24 11:07:00', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(660, 9033093257, 13, 'fsdfs', 9, 9397561466, NULL, NULL, NULL, NULL, 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-24 11:20:58', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(661, 9033093257, 13, 'fsdfs', 9, 9397561466, NULL, NULL, NULL, NULL, 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-24 11:25:14', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(662, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Больничная улица, 4', 228, 'Наличные', '2026-09-24 11:32:35', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeUwCkGkYcn@sRyb@sCmGyBgFll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '4059', '4.059', '54.43', '54.44', '51.46', '51.51'),
(663, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-24 11:45:43', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(664, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-24 11:46:27', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(665, 9397561466, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'fsdfs', 'Советская улица 2А', 'Советская улица, 11', 57, 'Наличные', '2026-09-24 11:47:04', NULL, NULL, NULL, 'itjyfBk_gdaBza@mE|UkB|_@cBzOQtDOhTHEnQ', '259', '0.259', '54.43', '54.44', '51.46', '51.51'),
(666, 9397561466, 9, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'canceled', 'fsdfs', 'Советская улица 2А', 'Советская улица, 11', 57, 'Наличные', '2026-09-24 11:47:30', NULL, NULL, NULL, 'itjyfBk_gdaBza@mE|UkB|_@cBzOQtDOhTHEnQ', '259', '0.259', '54.43', '54.44', '51.46', '51.51'),
(667, 9397561466, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'fsdfs', 'Советская улица 2А', 'Советская улица, 11', 57, 'Наличные', '2026-09-24 11:48:29', NULL, NULL, NULL, 'itjyfBk_gdaBza@mE|UkB|_@cBzOQtDOhTHEnQ', '259', '0.259', '54.43', '54.44', '51.46', '51.51'),
(668, 9397561466, 9, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'fsdfs', 'Советская улица 2А', 'Советская улица, 11', 57, 'Наличные', '2026-09-24 11:52:33', NULL, NULL, NULL, 'itjyfBk_gdaBza@mE|UkB|_@cBzOQtDOhTHEnQ', '259', '0.259', '54.43', '54.44', '51.46', '51.51'),
(669, 9397561466, 9, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'fsdfs', 'Советская улица 2А', 'Советская улица, 11', 57, 'Наличные', '2026-09-24 11:56:28', NULL, NULL, NULL, 'itjyfBk_gdaBza@mE|UkB|_@cBzOQtDOhTHEnQ', '259', '0.259', '54.43', '54.44', '51.46', '51.51'),
(670, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Советская улица, 11', 155, 'Наличные', '2026-09-25 07:11:56', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeU~h@wF|UkB|_@cBzOQtDOhTHEnQ', '2450', '2.45', '54.43', '54.44', '51.46', '51.51'),
(671, 9033093257, 13, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Дмитрий', 'Мичурина 23', 'Больничная улица, 4', 228, 'Наличные', '2026-09-25 07:13:24', NULL, NULL, NULL, '_qxyfB{ntcaBbrAl`EdDbK_DnOeCzLps@rPnN`Df_@sqBdpAkaH~y@ri@fg@b_@~x@zl@zB`BbpAf_A|H_ApZaFpA[lF_BjG_DfGuIjCcIhCkMvCiZfAcLj@kVD}[o@aGiDg[e^{kB}@iEsXmrA}@}EwXarAqLgl@kAmFoMyl@gBuIeFkVsAeF}HeUwCkGkYcn@sRyb@sCmGyBgFll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '4059', '4.059', '54.43', '54.44', '51.46', '51.51'),
(672, 89397561466, 5, 'Михаил', 5, 89397561466, 'Lada', 'Kalina', 'Black', 'E903TO763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 12:46:03', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(673, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 12:52:57', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(674, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 12:59:20', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(675, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:05:24', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(676, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:15:05', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(677, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:20:00', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51');
INSERT INTO `orders` (`id`, `customerPhone`, `userId`, `driverName`, `driverId`, `driverPhone`, `vehicleBrand`, `vehicleModel`, `vehicleColor`, `vehicleNumber`, `orderStatus`, `customerName`, `addressFrom`, `addressTo`, `price`, `paymentMethod`, `date`, `driverImage`, `customerImage`, `driverTime`, `encodedWay`, `routeDistanceMeters`, `routeDistanceKm`, `latFrom`, `latTo`, `lonFrom`, `lonTo`) VALUES
(678, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Больничная улица, 4', 144, 'Наличные', '2026-09-30 13:20:50', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '2207', '2.207', '54.43', '54.44', '51.46', '51.51'),
(679, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Больничная улица, 4', 144, 'Наличные', '2026-09-30 13:21:32', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '2207', '2.207', '54.43', '54.44', '51.46', '51.51'),
(680, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:22:25', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(681, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:26:07', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(682, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:38:23', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(683, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:38:53', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(684, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:39:32', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(685, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 13:46:45', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(686, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 14:48:08', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(687, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 14:48:54', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(688, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 14:50:09', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(689, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 14:53:42', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(690, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 14:55:12', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(691, 89397561466, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 'Михаил', 'Вокзальная 6', 'Больничная улица, 4', 144, 'Наличные', '2026-09-30 14:57:57', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRll@miApb@ax@xXmh@pMiVnHaNdAwBvJ}QzFqKbWye@`_@cr@tHoMv[oe@xAyBeBqXAkcBIyF?uJAoKr@{KdBgIbCmGvDkHdxBilCp^ec@|p@gx@~wBsiCvJoLlAwApHyOlPgX~KwQ|[UjFE?eU', '2207', '2.207', '54.43', '54.44', '51.46', '51.51'),
(692, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'complete', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 15:07:06', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51'),
(693, 89397561466, 5, 'Дмитрий', 13, 9033093257, 'KIA', 'RIO', 'Black', 'B487MP763', 'canceled', 'Михаил', 'Вокзальная 6', 'Советская улица, 11', 86, 'Наличные', '2026-09-30 15:08:56', NULL, NULL, NULL, 'kpryfByxtdaBbCpF\\x@vG`ObLdWz@dBfM~XzDhIrSxb@tAvCz^dy@lFhLxUvg@fIxQhCzFlFpLrG|NlC`GhDtH~IzRxBfFrClGrRxb@jYbn@vCjG~h@wF|UkB|_@cBzOQtDOhTHEnQ', '905', '0.905', '54.43', '54.44', '51.46', '51.51');

-- --------------------------------------------------------

--
-- Table structure for table `push_subscriptions`
--

CREATE TABLE `push_subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `endpoint` text NOT NULL,
  `endpoint_hash` char(64) NOT NULL,
  `p256dh` text NOT NULL,
  `auth` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `push_subscriptions`
--

INSERT INTO `push_subscriptions` (`id`, `user_id`, `endpoint`, `endpoint_hash`, `p256dh`, `auth`, `created_at`, `updated_at`) VALUES
(18, 15, 'https://fcm.googleapis.com/fcm/send/cdbOq59Y714:APA91bELuaNqYZM1Xb7oDp01gFtOctPS5GboCZuBCRESXn2OVKasoMOwuaAtM1SPrbJX69xGtJvjpvNbqqwG4yspPt-DHjsYAatYW8VvtCXvbyZHR9gaPJ7LPtgpNtFGmTUSP8WAQZfa', '0c50e0d1503a09cdc3c5869bcfda2b26cbfd41b15aa48b44d0e38cd9d2cdce1a', 'BA--RMModzL_K4g6ThIXlss2FWC7_o-9UL2Resg48fUAj1ki-jllLJD1hNsgkMU-bDObqQgM7dc1HLATnx9Y57w', 'YAVZ8qj4To_wjO2_GOUWvg', '2026-09-30 11:12:16', '2026-09-30 11:12:16'),
(38, 5, 'https://fcm.googleapis.com/fcm/send/fIgxxT3jXh4:APA91bEx81gdoQ_IVNcbl6Ri47qzr7e25M3m-Rzrpeywxvjkmxc2vIDFsIvSXDRo5kIf7tSCI4zEGKIJVd-DWX65EKJKEhw16opkW_ZCwNXmiliUklBdhFeV2JcKzeiAMYN-c6r1O7tu', 'ed1bffbb6565eae3311879e95b75cf71ad5624422122a8e8d0705d0c491ad549', 'BH2hJ6ZaEDiOjkSeeO1t_iq9VzbZ_LHLzKjUiyQL4SGTzCdM-hmVLfucsVk31FSzi5k2WVFarZtDyhQ5GfLLl0k', 'YTcAwiZC3OwWzxMVwut8Ew', '2026-09-30 13:38:01', '2026-09-30 13:38:01'),
(43, 14, 'https://wns2-db5p.notify.windows.com/w/?token=BQYAAAASZkW8C3unTpKsV5BbDwj%2bPVJfUiAYmIL6aeR2lSUfSzgBrtd2KHMccJHwm2stgRpodoHnYB8Dw0kuDt94Cj7weq0WMBinisXCuVdX6LFPoSgo24X1oPrIjHK9799%2bQJsSwGwN3WB0M1Lp%2bCecZj6os26NHIqOvzQBgd%2bUUsqC1ZKZNxOidJmiEmCogpzM3DYUHhx3gC0qp2am0W6huJQvhPUNO%2bMEBMSRZULzZMplyso51gGZq7%2f%2fafbZwoEtysTb%2bmhFeeQdbutsCmbCxEbpk4hJkdeWkPYKOOkcxOHf5PaecaX37OsVUMswnjH0qM7hxJ1B%2bfwVvfqm5zk0jc5e', '534e22046cbe9b4b451475d3f657e11dd8e1890b0ce7d64d67d78a0721cda7ac', 'BD6TPXT03ffnxMd8D8UNPJBzcqq9hY-UuuyebJCoYTIiqyVv55GEX-qM_M7HZEBhfwu8fF8Zq5sHDWD82HUjy8s', 'Wvb2x5cudJ4AQFjurM9AhA', '2026-09-30 14:02:13', '2026-09-30 14:02:13'),
(50, 13, 'https://fcm.googleapis.com/fcm/send/de_pdtM1wbY:APA91bFxP1QuzOofFCt-ozKi-ZgKXVyJtOervLdTeJSPIV-8HF-79Rt8BwJZixiAKp-PUuW6CzY4VVbCQBwpzsZqZovz7LhQteU8CeDN4okaxDnlId8ZbN1lMR6Rk3jNBXdZzz0ZCIDk', 'e622df4a57995f0b43ece4cc4ecb3a026c0b60be4b3e7cfbd8db84d33487025a', 'BA8mwdPwBBwACcJO9E4mwiDFbd2ttC7HFnH91-SkYwq9F5YDOwJz3ryYIzDVV6mSwAwoo0JJr5tMQg-Z4nsXas0', '8_o_zn8FXyg49HwkFrCWXA', '2026-09-30 14:30:14', '2026-09-30 14:30:14');

-- --------------------------------------------------------

--
-- Table structure for table `userphoto`
--

CREATE TABLE `userphoto` (
  `Approved` int(1) NOT NULL DEFAULT 0,
  `PhotoId` int(11) NOT NULL,
  `User` int(11) NOT NULL,
  `UploadTime` datetime NOT NULL DEFAULT current_timestamp(),
  `UserPhoto` text DEFAULT NULL,
  `PhotoWarningDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userphoto`
--

INSERT INTO `userphoto` (`Approved`, `PhotoId`, `User`, `UploadTime`, `UserPhoto`, `PhotoWarningDescription`) VALUES
(4, 6, 1, '2025-04-18 15:01:04', 'users\\c3b7f054a66aa259eaeff4865c0f10dc\\eaHe0t5q590IXu9MA09mC2t-dsQyNMzfUqRYyLjy95nd_oZ5JJtjbu543Sh3Gnqro2vJWe3OnfdELCPza6CD74PO.jpg', 'статус 4 - отменен'),
(0, 10, 3, '2025-04-21 13:50:27', NULL, NULL),
(0, 11, 4, '2025-04-22 09:52:27', NULL, NULL),
(3, 12, 5, '2025-04-22 10:08:46', 'users\\cb6102c93797c0c3cd2857b5bdeee3df\\photo_2026-04-13_13-58-02.jpg', NULL),
(0, 15, 8, '2025-04-25 22:03:54', NULL, NULL),
(0, 16, 9, '2025-04-25 22:22:46', NULL, NULL),
(0, 17, 10, '2025-04-25 22:28:21', NULL, NULL),
(0, 18, 11, '2025-04-25 22:55:16', NULL, NULL),
(0, 19, 12, '2026-05-18 21:47:16', NULL, NULL),
(0, 20, 13, '2026-05-19 11:10:43', NULL, NULL),
(0, 21, 14, '2026-06-16 13:45:48', NULL, NULL),
(0, 22, 15, '2026-09-30 15:11:36', NULL, NULL),
(0, 23, 16, '2026-10-01 17:44:07', NULL, NULL),
(1, 24, 17, '2026-10-01 17:47:06', 'users/f592da7a3028e27a5e1213c2375a0443/7d79b631d291401bf511e1a8114c3d2d.jpg', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD UNIQUE KEY `UserId_2` (`UserId`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `ActiveOrder` (`ActiveOrder`),
  ADD KEY `ActiveOrder_2` (`ActiveOrder`),
  ADD KEY `UserId_3` (`UserId`),
  ADD KEY `ActiveOrder_3` (`ActiveOrder`),
  ADD KEY `ActiveOrder_4` (`ActiveOrder`);

--
-- Indexes for table `eatproducts`
--
ALTER TABLE `eatproducts`
  ADD PRIMARY KEY (`ProductId`),
  ADD KEY `RestauranId` (`RestaurantId`);

--
-- Indexes for table `eatrestaurants`
--
ALTER TABLE `eatrestaurants`
  ADD PRIMARY KEY (`RestaurantId`);

--
-- Indexes for table `eatstats`
--
ALTER TABLE `eatstats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `eatusers`
--
ALTER TABLE `eatusers`
  ADD PRIMARY KEY (`UserId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `UserId` (`userId`),
  ADD KEY `idx_orders_user_status_date` (`userId`,`orderStatus`,`date`);

--
-- Indexes for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `endpoint_hash` (`endpoint_hash`),
  ADD KEY `idx_push_subscriptions_user` (`user_id`);

--
-- Indexes for table `userphoto`
--
ALTER TABLE `userphoto`
  ADD PRIMARY KEY (`PhotoId`),
  ADD KEY `User` (`User`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `eatproducts`
--
ALTER TABLE `eatproducts`
  MODIFY `ProductId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `eatrestaurants`
--
ALTER TABLE `eatrestaurants`
  MODIFY `RestaurantId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `eatstats`
--
ALTER TABLE `eatstats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `eatusers`
--
ALTER TABLE `eatusers`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=694;

--
-- AUTO_INCREMENT for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `userphoto`
--
ALTER TABLE `userphoto`
  MODIFY `PhotoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `accounts` (`UserId`);

--
-- Constraints for table `userphoto`
--
ALTER TABLE `userphoto`
  ADD CONSTRAINT `userphoto_ibfk_1` FOREIGN KEY (`User`) REFERENCES `accounts` (`UserId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

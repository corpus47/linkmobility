-- phpMyAdmin SQL Dump
-- version 4.9.7deb1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2021. Aug 25. 19:16
-- Kiszolgáló verziója: 8.0.26-0ubuntu0.21.04.3
-- PHP verzió: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `linkmob`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int NOT NULL,
  `Login` varchar(255) NOT NULL,
  `Pwd` varchar(255) NOT NULL,
  `Salt` varchar(255) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `Phone` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Active` int DEFAULT NULL,
  `LPNumber` varchar(10) NOT NULL,
  `UserType` int DEFAULT NULL,
  `ModulesRule` varchar(255) DEFAULT NULL,
  `DateOfAdd` datetime NOT NULL,
  `Partner_ID` int NOT NULL COMMENT 'Ki adta hozzá',
  `Locked` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `Login`, `Pwd`, `Salt`, `FullName`, `Phone`, `Email`, `Active`, `LPNumber`, `UserType`, `ModulesRule`, `DateOfAdd`, `Partner_ID`, `Locked`) VALUES
(1, 'corpus', '66f6f02b31100e3c02c4a2878181df6f161a977c', '26f8d3e969', 'Csupor Béla', '06309592222', 'csupor.bela@homedt.me', 1, 'ILN-156', 0, '', '2017-05-08 06:22:00', 0, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_logged`
--

CREATE TABLE `user_logged` (
  `ID` int NOT NULL,
  `Uid` int DEFAULT NULL,
  `MasterUid` int DEFAULT NULL,
  `LoginTime` datetime DEFAULT NULL,
  `Session` varchar(255) DEFAULT NULL,
  `IP` varchar(15) DEFAULT NULL,
  `LastCheck` datetime DEFAULT NULL,
  `Logout` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- A tábla adatainak kiíratása `user_logged`
--

INSERT INTO `user_logged` (`ID`, `Uid`, `MasterUid`, `LoginTime`, `Session`, `IP`, `LastCheck`, `Logout`) VALUES
(6, 1, NULL, '2021-08-25 16:51:43', 'm5qn12np2kupbkt1hfr4km6u6s', '127.0.0.1', '2021-08-25 18:20:20', '2021-08-25 18:29:40'),
(7, 1, NULL, '2021-08-25 17:42:08', 'm5qn12np2kupbkt1hfr4km6u6s', '127.0.0.1', '2021-08-25 18:20:20', '2021-08-25 18:29:40'),
(8, 1, NULL, '2021-08-25 18:20:30', 'm5qn12np2kupbkt1hfr4km6u6s', '127.0.0.1', '2021-08-25 18:29:40', '2021-08-25 18:29:40'),
(9, 1, NULL, '2021-08-25 18:29:53', 'm5qn12np2kupbkt1hfr4km6u6s', '127.0.0.1', '2021-08-25 18:36:04', NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `user_logged`
--
ALTER TABLE `user_logged`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT a táblához `user_logged`
--
ALTER TABLE `user_logged`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.2.6deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 14, 2014 at 05:11 PM
-- Server version: 5.6.19-1~exp1ubuntu2
-- PHP Version: 5.5.12-2ubuntu4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `COMP3550PROJECT`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `screen_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`screen_name`) VALUES
('ahmedbedair89'),
('Aminugmm'),
('appgameplugin'),
('BestMackIemore'),
('blackneko_'),
('BloodyHale_'),
('bridryan'),
('BrittGuerra_'),
('capselyse'),
('Carolina87N'),
('ccosmee'),
('chanfanxo'),
('CJones0071'),
('connormaher3'),
('Dashery'),
('Delyyyyy55'),
('Demasu_77'),
('diannenicoledg'),
('DylanB96'),
('e4hmarin'),
('Elianetteeee'),
('EngineersDay'),
('En_Passant_'),
('extremecareer'),
('FahadFanzee'),
('franktantani'),
('gothyung'),
('habarizakwetu'),
('HersheyyCHRISS'),
('iam_mcroger'),
('imjalrivera'),
('Ioathes'),
('johanstahhl'),
('kavidarling16'),
('Kenna_Grace2'),
('kentay71'),
('KimmieDG'),
('LIZQUENfinity'),
('Luuwqe__Coegfu'),
('mandydoherty65'),
('matt_tee'),
('mehndirattagun1'),
('MiwnahhGD'),
('MowienaticsRose'),
('MrMortonScience'),
('OMGFamForLife'),
('paperwrist'),
('PeterLewis_TGS'),
('Saruzki'),
('ShenicaDeandra'),
('stimie01'),
('thefrayharry'),
('TheHumanBot'),
('thisladHanzel'),
('TobyAtkinson2'),
('trashydaddy'),
('videodatechat'),
('yokhanbin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD UNIQUE KEY `screen_name` (`screen_name`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

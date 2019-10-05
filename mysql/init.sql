CREATE DATABASE bitcoin;
USE bitcoin;
CREATE TABLE `auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `birthday` varchar(10) DEFAULT NULL,
  `contact` varchar(15) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(25) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `userid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `bid` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phash` varchar(500) DEFAULT NULL,
  `uhash` varchar(500) DEFAULT NULL,
  `amount` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `propertydata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `homeadd` varchar(100) DEFAULT NULL,
  `amount` varchar(20) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `image` blob,
  `address` varchar(500) DEFAULT NULL,
  `owner` varchar(500) DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  `area` varchar(15) DEFAULT NULL,
  `deed` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

GRANT ALL PRIVILEGES ON bitcoin.* TO 'root'@'%' WITH GRANT OPTION;

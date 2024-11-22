
-- CREATE DATABASE encontreNaUfms;

-- Creating tables
CREATE TABLE `Users` (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255),
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Locales` (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `localizationLink` varchar(511) NOT NULL,
    `latitude` decimal(20, 16) NOT NULL,
    `longitude` decimal(20, 16) NOT NULL,
    `address` varchar(60) NOT NULL,
    `about` text, -- old description
    `observation` text,
    `type` tinyint(2) NOT NULL,
    `phoneNumber` varchar(11),
    `accessibility` tinyint(1),
    `grade` decimal(10, 1) NOT NULL DEFAULT '0.0',
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ScheduledHours` (
    `localeId` int NOT NULL,
    `sundayHours` varchar(20),
    `mondayHours` varchar(20),
    `tuesdayHours` varchar(20),
    `wednesdayHours` varchar(20),
    `thursdayHours` varchar(20),
    `fridayHours` varchar(20),
    `saturdayHours` varchar(20),
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Photos` (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `localeId` int NOT NULL,
    `name` varchar(255) NOT NULL,
    `url` text NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Favorites` (
    `userId` int NOT NULL,
    `localeId` int NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Histories` (
    `userId` int NOT NULL,
    `localeId` int NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Reviews` (
    `userId` int NOT NULL,
    `localeId` int NOT NULL,
    `grade` numeric NOT NULL DEFAULT '0',
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- types -- 10 -- 4 with tables 
-- AcademicBlocks (Table), TouristPoints (No Table), Banks (No Table), 
-- Foods (No Table), HelthServices (No Table), Libraries (Table),
-- Sports (Table), Transports (Table), ParkingLots (No Table), 
-- Buildings (No Table) 

CREATE TABLE `AcademicBlocks` (
    `localeId` int NOT NULL,
    `course` varchar(30) NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Libraries` (
    `localeId` int NOT NULL,
    `libraryLink` varchar(30) NOT NULL,
    `rules` text,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Sports` (
    `localeId` int NOT NULL,
    `availableSports` varchar(255) NOT NULL,
    `rules` text,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Transports` (
    `localeId` int NOT NULL,
    `availableBuses` varchar(30) NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Constraints --
ALTER TABLE `ScheduledHours`
    ADD UNIQUE KEY `localeId` (`localeId`),
    ADD CONSTRAINT `ScheduledHours_ibfk_1` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Photos`
    ADD KEY `localeId` (`localeId`),
    ADD CONSTRAINT `Photos_ibfk_1` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Favorites`
    ADD UNIQUE KEY (`userId`, `localeId`),
    ADD CONSTRAINT `Favorites_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `Favorites_ibfk_2` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Histories`
    ADD UNIQUE KEY (`userId`, `localeId`),
    ADD CONSTRAINT `Histories_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `Histories_ibfk_2` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Reviews`
    ADD UNIQUE KEY (`userId`, `localeId`),
    ADD CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `Reviews_ibfk_2` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `AcademicBlocks`
    ADD UNIQUE KEY `localeId` (`localeId`),
    ADD CONSTRAINT `AcademicBlocks_ibfk_1` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Libraries`
    ADD UNIQUE KEY `localeId` (`localeId`),
    ADD CONSTRAINT `Libraries_ibfk_1` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Sports`
    ADD UNIQUE KEY `localeId` (`localeId`),
    ADD CONSTRAINT `Sports_ibfk_1` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Transports`
    ADD UNIQUE KEY `localeId` (`localeId`),
    ADD CONSTRAINT `Transports_ibfk_1` FOREIGN KEY (`localeId`) REFERENCES `Locales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


--- Trigger creations

CREATE TRIGGER insert_review_grades_updater
AFTER INSERT
ON Reviews
FOR EACH ROW
    UPDATE Locales AS locale
    SET grade = (
        SELECT AVG(grade)
        FROM Reviews AS review
        WHERE review.localeId = NEW.localeId
    )
    WHERE locale.id = NEW.localeId;

CREATE TRIGGER update_review_grades_updater
AFTER UPDATE
ON Reviews
FOR EACH ROW
    UPDATE Locales AS locale
    SET grade = (
        SELECT AVG(grade)
        FROM Reviews AS review
        WHERE review.localeId = NEW.localeId
    )
    WHERE locale.id = NEW.localeId;
   
CREATE TRIGGER delete_review_grades_updater
AFTER DELETE
ON Reviews
FOR EACH ROW
    UPDATE Locales AS locale
    SET grade = IFNULL( (
        SELECT AVG(grade)
        FROM Reviews AS review
        WHERE review.localeId = OLD.localeId
    ), '0.0')
    WHERE locale.id = OLD.localeId;
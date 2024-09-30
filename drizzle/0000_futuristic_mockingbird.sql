CREATE TABLE `AcademicBlocks` (
	`localeId` int NOT NULL,
	`course` varchar(30) NOT NULL,
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `AcademicBlocks_localeId_unique` UNIQUE(`localeId`)
);
--> statement-breakpoint
CREATE TABLE `Favorites` (
	`userId` int NOT NULL,
	`localeId` int NOT NULL,
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Favorites_unique` UNIQUE(`localeId`, `userId`)
);
--> statement-breakpoint
CREATE TABLE `Histories` (
	`userId` int NOT NULL,
	`localeId` int NOT NULL,
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Histories_unique` UNIQUE(`localeId`, `userId`)
);
--> statement-breakpoint
CREATE TABLE `Libraries` (
	`localeId` int NOT NULL,
	`libraryLink` varchar(30) NOT NULL,
	`rules` text,
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Libraries_localeId_unique` UNIQUE(`localeId`)
);
--> statement-breakpoint
CREATE TABLE `Locales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`localization_link` varchar(255) NOT NULL,
	`latitude` decimal(10, 3) NOT NULL,
  `longitude` decimal(10, 3) NOT NULL,
	`address` varchar(60) NOT NULL,
	`about` text,
	`observation` text,
	`type` tinyint NOT NULL,
	`phone_number` varchar(11),
	`accessibility` tinyint,
	`grade` decimal(10, 1) NOT NULL DEFAULT '0.0',
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Locales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`localeId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`data` mediumblob NOT NULL,
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Photos_id` PRIMARY KEY(`id`),
	CONSTRAINT `Photos_localeId_unique` UNIQUE(`localeId`)
);
--> statement-breakpoint
CREATE TABLE `Reviews` (
	`userId` int NOT NULL,
	`localeId` int NOT NULL,
	`grade` decimal NOT NULL DEFAULT '0.0',
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Reviews_unique` UNIQUE(`localeId`, `userId`)
);
--> statement-breakpoint
CREATE TABLE `ScheduledHours` (
	`localeId` int NOT NULL,
	`sundayHours` varchar(20),
	`mondayHours` varchar(20),
	`tuesdayHours` varchar(20),
	`wednesdayHours` varchar(20),
	`thursdayHours` varchar(20),
	`fridayHours` varchar(20),
	`saturdayHours` varchar(20),
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `ScheduledHours_localeId_unique` UNIQUE(`localeId`)
);
--> statement-breakpoint
CREATE TABLE `Sports` (
	`localeId` int NOT NULL,
	`availableSports` varchar(255) NOT NULL,
	`rules` text,
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Sports_localeId_unique` UNIQUE(`localeId`)
);
--> statement-breakpoint
CREATE TABLE `Transports` (
	`localeId` int NOT NULL,
	`availableBuses` varchar(30) NOT NULL,
	`rules` text,
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Transports_localeId_unique` UNIQUE(`localeId`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`createdAt` date NOT NULL,
	`updatedAt` date NOT NULL,
	CONSTRAINT `Users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `AcademicBlocks` ADD CONSTRAINT `AcademicBlocks_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Favorites` ADD CONSTRAINT `Favorites_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Histories` ADD CONSTRAINT `Histories_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Libraries` ADD CONSTRAINT `Libraries_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Photos` ADD CONSTRAINT `Photos_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_userId_Users_id_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ScheduledHours` ADD CONSTRAINT `ScheduledHours_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Sports` ADD CONSTRAINT `Sports_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Transports` ADD CONSTRAINT `Transports_localeId_Locales_id_fk` FOREIGN KEY (`localeId`) REFERENCES `Locales`(`id`) ON DELETE cascade ON UPDATE cascade;
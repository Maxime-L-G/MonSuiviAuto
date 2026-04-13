-- CreateTable
CREATE TABLE `Reminder` (
    `id` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `type` ENUM('INSPECTION', 'INSURANCE', 'OIL_CHANGE', 'CUSTOM') NOT NULL DEFAULT 'CUSTOM',
    `title` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'DONE') NOT NULL DEFAULT 'OPEN',
    `dueDate` DATETIME(3) NULL,
    `dueMileage` INTEGER NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Reminder_vehicleId_idx`(`vehicleId`),
    INDEX `Reminder_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reminder` ADD CONSTRAINT `Reminder_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

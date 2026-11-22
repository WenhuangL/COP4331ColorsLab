-- Test database for CI only. Mirrors the tables the PHP API in api/ expects.
-- Run as MySQL root: mysql -uroot -proot < tests/fixtures/seed.sql

CREATE DATABASE IF NOT EXISTS COP4331;

-- Same DB user the PHP files connect with
CREATE USER IF NOT EXISTS 'TheBeast'@'localhost' IDENTIFIED BY 'WeLoveCOP4331';
GRANT ALL PRIVILEGES ON COP4331.* TO 'TheBeast'@'localhost';
FLUSH PRIVILEGES;

USE COP4331;

CREATE TABLE IF NOT EXISTS Users (
  ID INT NOT NULL AUTO_INCREMENT,
  DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  DateLastLoggedIn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Login VARCHAR(50) NOT NULL DEFAULT '',
  Password VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Colors (
  ID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL DEFAULT '',
  UserID INT NOT NULL DEFAULT 0,
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- Fake test account (not a real user)
INSERT INTO Users (FirstName, LastName, Login, Password)
VALUES ('Test', 'User', 'testuser', 'testpass');

INSERT INTO Colors (Name, UserID) VALUES
  ('Blue', 1), ('Light Blue', 1), ('Red', 1), ('Green', 1);

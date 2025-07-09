-- Initialize database for Mall App
-- This script creates the database and user if they don't exist

-- Create the database
CREATE DATABASE IF NOT EXISTS mall_app_production;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'mall_user'@'%' IDENTIFIED BY 'mall_password_2025';

-- Grant privileges
GRANT ALL PRIVILEGES ON mall_app_production.* TO 'mall_user'@'%';
FLUSH PRIVILEGES;

-- Switch to the database
USE mall_app_production;

-- Enable UUID extension (PostgreSQL only)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
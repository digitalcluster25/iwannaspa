-- Добавляем поля для карты и адреса в таблицу spas
ALTER TABLE spas ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE spas ADD COLUMN IF NOT EXISTS address_comment TEXT;
ALTER TABLE spas ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE spas ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

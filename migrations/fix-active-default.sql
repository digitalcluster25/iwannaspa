-- Дополнительная миграция: Исправление DEFAULT для active

-- Убедимся что у active есть DEFAULT значение
ALTER TABLE profiles ALTER COLUMN active SET DEFAULT false;

-- Обновим все существующие записи где active = NULL
UPDATE profiles SET active = true WHERE active IS NULL AND role IN ('admin', 'user');
UPDATE profiles SET active = false WHERE active IS NULL AND role = 'vendor';

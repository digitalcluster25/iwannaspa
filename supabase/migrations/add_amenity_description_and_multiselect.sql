-- Добавляем поле description в таблицу amenities
ALTER TABLE amenities ADD COLUMN IF NOT EXISTS description TEXT;

-- Добавляем category и purpose как массивы в spas (для мультивыбора)
-- Сначала добавляем новые колонки
ALTER TABLE spas ADD COLUMN IF NOT EXISTS categories TEXT[];
ALTER TABLE spas ADD COLUMN IF NOT EXISTS purposes TEXT[];

-- Копируем данные из старых колонок (если есть)
UPDATE spas SET categories = ARRAY[category] WHERE category IS NOT NULL AND categories IS NULL;
UPDATE spas SET purposes = ARRAY[purpose] WHERE purpose IS NOT NULL AND purposes IS NULL;

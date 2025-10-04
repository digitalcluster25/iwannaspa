-- Настройка ролей для PostgREST
-- Создание роли web_anon для анонимного доступа

-- Создаем роль web_anon если не существует
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'web_anon') THEN
        CREATE ROLE web_anon NOLOGIN;
    END IF;
END
$$;

-- Даем права на схему app
GRANT USAGE ON SCHEMA app TO web_anon;

-- Даем права на чтение всех таблиц
GRANT SELECT ON ALL TABLES IN SCHEMA app TO web_anon;

-- Даем права на последовательности
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO web_anon;

-- Даем права на функции
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app TO web_anon;

-- Создаем роль web_auth для аутентифицированных пользователей
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'web_auth') THEN
        CREATE ROLE web_auth NOLOGIN;
    END IF;
END
$$;

-- Даем права на схему app
GRANT USAGE ON SCHEMA app TO web_auth;

-- Даем полные права на все таблицы
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO web_auth;

-- Даем права на последовательности
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO web_auth;

-- Даем права на функции
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app TO web_auth;

-- Проверяем созданные роли
SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin 
FROM pg_roles 
WHERE rolname IN ('web_anon', 'web_auth', 'app_user', 'app_admin')
ORDER BY rolname;

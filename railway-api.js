#!/usr/bin/env node

/**
 * Простой API сервер для Railway PostgreSQL
 * Замена PostgREST для работы с базой данных
 */

import express from 'express';
import { Client } from 'pg';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Конфигурация Railway PostgreSQL
const dbConfig = {
  host: 'switchback.proxy.rlwy.net',
  port: 44855,
  database: 'railway',
  user: 'postgres',
  password: 'piAlmgrclkSirLRLJfGwJizmKrIpKaXs',
  ssl: {
    rejectUnauthorized: false
  }
};

// Подключение к базе данных
let dbClient;

async function connectDB() {
  try {
    dbClient = new Client(dbConfig);
    await dbClient.connect();
    console.log('✅ Подключение к Railway PostgreSQL установлено');
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message);
    process.exit(1);
  }
}

// Middleware для установки схемы
app.use(async (req, res, next) => {
  try {
    await dbClient.query('SET search_path TO app, public;');
    next();
  } catch (error) {
    console.error('Ошибка установки схемы:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// API Routes

// GET /countries
app.get('/countries', async (req, res) => {
  try {
    const { rows } = await dbClient.query('SELECT * FROM countries ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения стран:', error.message);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// GET /cities
app.get('/cities', async (req, res) => {
  try {
    const { rows } = await dbClient.query('SELECT * FROM cities ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения городов:', error.message);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// GET /categories
app.get('/categories', async (req, res) => {
  try {
    const { rows } = await dbClient.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения категорий:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /purposes
app.get('/purposes', async (req, res) => {
  try {
    const { rows } = await dbClient.query('SELECT * FROM purposes ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения целей:', error.message);
    res.status(500).json({ error: 'Failed to fetch purposes' });
  }
});

// GET /amenities
app.get('/amenities', async (req, res) => {
  try {
    const { rows } = await dbClient.query('SELECT * FROM amenities ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения удобств:', error.message);
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

// GET /spas
app.get('/spas', async (req, res) => {
  try {
    const { rows } = await dbClient.query(`
      SELECT 
        s.*,
        c.name as city_name,
        b.name as brand_name
      FROM spas s
      LEFT JOIN cities c ON s.city_id = c.id
      LEFT JOIN brands b ON s.brand_id = b.id
      ORDER BY s.name
    `);
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения СПА:', error.message);
    res.status(500).json({ error: 'Failed to fetch spas' });
  }
});

// GET /spa_services
app.get('/spa_services', async (req, res) => {
  try {
    const { rows } = await dbClient.query(`
      SELECT 
        ss.*,
        s.name as spa_name
      FROM spa_services ss
      LEFT JOIN spas s ON ss.spa_id = s.id
      ORDER BY s.name, ss.name
    `);
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения услуг:', error.message);
    res.status(500).json({ error: 'Failed to fetch spa services' });
  }
});

// GET /profiles
app.get('/profiles', async (req, res) => {
  try {
    const { rows } = await dbClient.query('SELECT * FROM profiles ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения профилей:', error.message);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// GET /brands
app.get('/brands', async (req, res) => {
  try {
    const { rows } = await dbClient.query('SELECT * FROM brands ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения брендов:', error.message);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// GET /service_templates
app.get('/service_templates', async (req, res) => {
  try {
    const { rows } = await dbClient.query('SELECT * FROM service_templates ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения шаблонов услуг:', error.message);
    res.status(500).json({ error: 'Failed to fetch service templates' });
  }
});

// GET /leads
app.get('/leads', async (req, res) => {
  try {
    const { rows } = await dbClient.query(`
      SELECT 
        l.*,
        s.name as spa_name
      FROM leads l
      LEFT JOIN spas s ON l.spa_id = s.id
      ORDER BY l.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Ошибка получения заявок:', error.message);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// POST /leads
app.post('/leads', async (req, res) => {
  try {
    const { spa_id, customer_name, customer_phone, customer_email, selected_services, total_amount, message, visit_date } = req.body;
    
    const { rows } = await dbClient.query(`
      INSERT INTO leads (spa_id, customer_name, customer_phone, customer_email, selected_services, total_amount, message, visit_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [spa_id, customer_name, customer_phone, customer_email, JSON.stringify(selected_services), total_amount, message, visit_date]);
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Ошибка создания заявки:', error.message);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Generic POST endpoint for any table in 'app' schema
app.post('/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const data = req.body;
  
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO app.${tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const { rows } = await dbClient.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error.message);
    res.status(500).json({ error: `Failed to insert into ${tableName}`, details: error.message });
  }
});

// Generic PUT endpoint for any table in 'app' schema
app.put('/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  const data = req.body;
  
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
    
    const query = `
      UPDATE app.${tableName}
      SET ${setClause}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    
    const { rows } = await dbClient.query(query, [...values, id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error.message);
    res.status(500).json({ error: `Failed to update ${tableName}`, details: error.message });
  }
});

// Generic DELETE endpoint for any table in 'app' schema
app.delete('/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  
  try {
    const query = `DELETE FROM app.${tableName} WHERE id = $1`;
    await dbClient.query(query, [id]);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting from ${tableName}:`, error.message);
    res.status(500).json({ error: `Failed to delete from ${tableName}`, details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generic GET endpoint for any table in 'app' schema
app.get('/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const { rows } = await dbClient.query(`SELECT * FROM app.${tableName}`);
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error.message);
    res.status(500).json({ error: `Failed to fetch from ${tableName}`, details: error.message });
  }
});

// Generic POST endpoint for any table in 'app' schema
app.post('/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const data = req.body;
  
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO app.${tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const { rows } = await dbClient.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error.message);
    res.status(500).json({ error: `Failed to insert into ${tableName}`, details: error.message });
  }
});

// Generic PUT endpoint for any table in 'app' schema
app.put('/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  const data = req.body;
  
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
    
    const query = `
      UPDATE app.${tableName}
      SET ${setClause}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    
    const { rows } = await dbClient.query(query, [...values, id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error.message);
    res.status(500).json({ error: `Failed to update ${tableName}`, details: error.message });
  }
});

// Generic DELETE endpoint for any table in 'app' schema
app.delete('/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  
  try {
    const query = `DELETE FROM app.${tableName} WHERE id = $1`;
    await dbClient.query(query, [id]);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting from ${tableName}:`, error.message);
    res.status(500).json({ error: `Failed to delete from ${tableName}`, details: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Railway PostgreSQL API Server',
    version: '1.0.0',
    endpoints: [
           'GET /countries',
           'GET /cities',
           'GET /categories',
           'GET /purposes',
           'GET /amenities',
           'GET /spas',
           'GET /spa_services',
           'GET /profiles',
           'GET /brands',
           'GET /service_templates',
           'GET /leads',
      'POST /leads',
      'POST /:tableName',
      'PUT /:tableName/:id',
      'DELETE /:tableName/:id',
      'GET /health'
    ]
  });
});

// Запуск сервера
async function startServer() {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API сервер запущен на порту ${PORT}`);
    console.log(`📡 Доступен по адресу: http://localhost:${PORT}`);
    console.log(`🔗 Railway PostgreSQL подключен`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Получен сигнал SIGTERM, завершение работы...');
  if (dbClient) {
    await dbClient.end();
    console.log('🔌 Соединение с базой данных закрыто');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Получен сигнал SIGINT, завершение работы...');
  if (dbClient) {
    await dbClient.end();
    console.log('🔌 Соединение с базой данных закрыто');
  }
  process.exit(0);
});

startServer().catch(console.error);

import express from 'express';
import cors from 'cors';
import pg from 'pg';

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:piAlmgrclkSirLRLJfGwJizmKrIpKaXs@postgres.railway.internal:5432/railway',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Iwanna API v1.0' });
});

// Generic GET handler for any table
app.get('/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { select = '*', limit, offset, order, ...filters } = req.query;
    
    // Build query
    let query = `SELECT ${select} FROM ${table}`;
    const values = [];
    let valueIndex = 1;
    
    // Add filters
    const whereConditions = [];
    for (const [key, value] of Object.entries(filters)) {
      if (key.startsWith('_')) continue; // Skip special params
      whereConditions.push(`${key} = $${valueIndex}`);
      values.push(value);
      valueIndex++;
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    // Add order
    if (order) {
      query += ` ORDER BY ${order}`;
    }
    
    // Add pagination
    if (limit) {
      query += ` LIMIT $${valueIndex}`;
      values.push(parseInt(limit));
      valueIndex++;
    }
    
    if (offset) {
      query += ` OFFSET $${valueIndex}`;
      values.push(parseInt(offset));
    }
    
    console.log('Query:', query, 'Values:', values);
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('GET Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Insert
app.post('/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const data = req.body;
    
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`);
    
    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('POST Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH - Update
app.patch('/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { _id, ...updates } = req.body;
    const { id: queryId, ...queryFilters } = req.query;
    
    const id = _id || queryId;
    
    if (!id && Object.keys(queryFilters).length === 0) {
      return res.status(400).json({ error: 'ID or filters required for update' });
    }
    
    const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    const values = [...Object.values(updates)];
    
    let query = `UPDATE ${table} SET ${setClause.join(', ')}`;
    
    // Add WHERE conditions
    const whereConditions = [];
    let valueIndex = values.length + 1;
    
    if (id) {
      whereConditions.push(`id = $${valueIndex}`);
      values.push(id);
      valueIndex++;
    }
    
    for (const [key, value] of Object.entries(queryFilters)) {
      whereConditions.push(`${key} = $${valueIndex}`);
      values.push(value);
      valueIndex++;
    }
    
    query += ` WHERE ${whereConditions.join(' AND ')} RETURNING *`;
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('PATCH Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete('/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { id, ...filters } = req.query;
    
    if (!id && Object.keys(filters).length === 0) {
      return res.status(400).json({ error: 'ID or filters required for delete' });
    }
    
    const whereConditions = [];
    const values = [];
    let valueIndex = 1;
    
    if (id) {
      whereConditions.push(`id = $${valueIndex}`);
      values.push(id);
      valueIndex++;
    }
    
    for (const [key, value] of Object.entries(filters)) {
      whereConditions.push(`${key} = $${valueIndex}`);
      values.push(value);
      valueIndex++;
    }
    
    const query = `DELETE FROM ${table} WHERE ${whereConditions.join(' AND ')} RETURNING *`;
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('DELETE Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Iwanna API running on port ${PORT}`);
  console.log(`📊 Database: ${pool.options.connectionString?.split('@')[1]}`);
});

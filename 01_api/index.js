const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ Database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bookshop_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- ROUTES ---

app.get('/', (req, res) => res.send('Bookshop API Running...'));

// ✅ 0. เพิ่ม Route Health Check ตรงนี้ (สำคัญสำหรับ Docker/Jenkins)
app.get('/health', async (req, res) => {
  try {
    // ลอง Ping Database ดูว่ายังอยู่ดีไหม
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    // ถ้า DB พัง ให้ส่ง 500 กลับไป เพื่อให้ระบบรู้ว่า Server ป่วย
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// 1. GET Books
app.get('/books', async (req, res) => {
  try {
    const sql = `SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id ORDER BY b.id DESC`;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. GET Single Book
app.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT b.*, c.name as category_name 
       FROM books b 
       LEFT JOIN categories c ON b.category_id = c.id 
       WHERE b.id = ?`, 
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(rows[0]); 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3. POST Register
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });

        const [result] = await pool.query(
            'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
            [username, password, email, 'user']
        );
        res.json({ status: 'success', message: 'สมัครสมาชิกสำเร็จ!' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. POST Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await pool.query(
            'SELECT id, username, email, role FROM users WHERE username = ? AND password = ?', 
            [username, password]
        );
        
        if (users.length > 0) {
            res.json({ status: 'success', user: users[0] });
        } else {
            res.status(401).json({ status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 5. POST Orders
app.post('/orders', async (req, res) => {
    const { user_id, shipping_address, items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const total_price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const [orderResult] = await conn.query(
            'INSERT INTO orders (user_id, total_price, shipping_address, status) VALUES (?, ?, ?, ?)', 
            [user_id, total_price, shipping_address, 'paid']
        );
        const orderId = orderResult.insertId;
        
        for (const item of items) {
            await conn.query(
                'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)', 
                [orderId, item.book_id, item.quantity, item.price]
            );
            await conn.query(
                'UPDATE books SET stock = stock - ? WHERE id = ?', 
                [item.quantity, item.book_id]
            );
        }
        
        await conn.commit();
        res.json({ status: 'success', order_id: orderId });
    } catch (e) { 
        await conn.rollback(); 
        res.status(500).json({ error: e.message }); 
    } finally { 
        conn.release(); 
    }
});

// 6. GET Orders History
app.get('/orders', async (req, res) => {
    const { userId } = req.query; 
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        for (let order of orders) {
            const [items] = await pool.query(
                `SELECT oi.*, b.title, b.cover_image 
                 FROM order_items oi 
                 JOIN books b ON oi.book_id = b.id 
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }

        res.json({ orders });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on port ${port}`));
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS testdb');
    await connection.end();
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'testdb'
    });
    await db.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        author VARCHAR(255)
      )
    `);
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM books');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO books (title, author) VALUES
        ('1984', 'George Orwell'),
        ('To Kill a Mockingbird', 'Harper Lee'),
        ('Brave New World', 'Aldous Huxley')
      `);
    }
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();
app.get('/api/dogs', async (req, res) => {
  try {
    const [books] = await db.execute('
        SELECT
            d.name AS dog_name,
            d.size,
            u.username AS owner_username
        FROM Dogs d
        JOIN Users u ON d.ower_id = u.user_id');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [books] = await db.execute('
        SELECT
            wr.request_id,
            d.name AS dog_name,
            wr.requested_time,
            wr.duration_minutes,
            wr.location,
            u.username AS owner_username
        FROM WalkRequests wr
        JOIN Dogs d ON wr.dog.id = d.dog_id
        JOIN Users u ON d.owner_id = u.user_id
        WHERE wr.status = 'open'
        ');
            res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch walkrequests' });
  }
});

app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [books] = await db.execute('
        SELECT
            u.username AS walker_username,
            COUNT(r.rating_id) AS total_ratings,
            AVG(r.rating) AS average_rating,
            (
                SELECT COUNT(*)
                FROM WalkApplications wa
                JOIN WalkRequests wr ON wa.request_id = wr.request_id
                WHERE wa.walker_id = u.user_id AND wa.status = 'accepted' AND wr.status = 'completed'
        ) AS completed_walks
        FROM Users u
        LEFT JOIN walkRatings r ON u.user_id = r.walker_id
        WHERE u.role = 'walker'
        GROUP BY u.user_id');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch walkers' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

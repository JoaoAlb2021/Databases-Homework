const { Pool } = require('pg');
const express = require('express');
const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'Jo@o100494',
    port: 5432
});

app.get("/", function(req, res) {
    res.send("welcome to ECOMMERCE API");
});

app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/products", function(req, res) {
    pool.query(
        `select 
            products.product_name, 
            suppliers.supplier_name 
        from 
            products 
        INNER JOIN 
            suppliers on products.supplier_id=suppliers.id`, (error, result) => {
        res.json(result.rows);
    });
});


const port = 3000
app.listen(port, () => {
    console.log(`server listening on port ${port}: http://localhost:${port}`);
})
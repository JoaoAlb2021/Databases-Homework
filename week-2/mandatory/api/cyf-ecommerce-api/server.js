/////////////////////HOMEWORK WEEK 2///////////////////////////////

/////////////TASK 01/////////////////////
//NodeJS cyf_ecommerce create
/////////////////////////////////////////

/////////////TASK 02/////////////////////
//Express and postgres add
/////////////////////////////////////////

const { Pool } = require('pg');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());


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

/////////////TASK 03/////////////////////
app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});
/////////////////////////////////////////

/////////////TASK 04/////////////////////
app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});
/////////////////////////////////////////

/////////////TASK 05/////////////////////
app.get("/products", function(req, res) {
    const searchName = req.query.name

    pool.query(
        `select 
        products.product_name, 
        suppliers.supplier_name 
        from 
        products 
        INNER JOIN 
        suppliers on products.supplier_id=suppliers.id
        where products.product_name like '${searchName}%'`, (error, result) => {
            res.json(result.rows);
    });
});
/////////////////////////////////////////
///////////////////////////////////////////////////////////////////

/////////////////////HOMEWORK WEEK 3///////////////////////////////
///////////////TASK 01///////////////////
//Endpoint "products" create in the Homework week 2
/////////////////////////////////////////


///////////////TASK 02///////////////////
//Endpoint "products" update
/////////////////////////////////////////

///////////////TASK 03///////////////////
app.get('/customers/:customerId', function (req, res) {
    const customerId = req.params.customerId;
    pool.query(`SELECT * FROM suppliers where id = ${customerId}`, (error, result) => {
        res.json(result.rows);
    })
})
/////////////////////////////////////////

///////////////TASK 04///////////////////
app.post('/customers', function (req, res) {
    const newCustomer = req.body; 
    pool.query(
        `INSERT INTO customers (name,          address,               city,   country) 
                        VALUES ('${newCustomer.name}','${newCustomer.address}','${newCustomer.city}','${newCustomer.country}');
        SELECT * FROM customers where id =(SELECT MAX(id) FROM customers)`)
        .then(() => res.send("Customer created!"))
        .catch((e) => console.error(e));
})
/////////////////////////////////////////

///////////////TASK 05///////////////////
app.post('/products', function (req, res) {
    const newProductName = req.body.product_name; 
    const newProductPrice = req.body.unit_price; 
    const newProductSupplier = req.body.supplier_id; 

    if (!Number.isInteger(newProductPrice) || newProductPrice <= 0) {
        return res
          .status(400)
          .send("The product's price should be a positive.");
        }

    pool
    .query("SELECT * FROM suppliers WHERE id=$1", [newProductSupplier])
    .then((result) => {
        if (result.rows.length > 0) {
            const query =
            "INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3)";
            pool
                .query(query, [newProductName, newProductPrice, newProductSupplier])
                .then(() => res.send("Product created!"))
                .catch((e) => console.error(e));
        } else {
            return res
            .status(400)
            .send("A supplier don't exists!");
        }
    })    
})
/////////////////////////////////////////

///////////////TASK 06///////////////////
app.post('/customers/:customerId/orders', function(req, res) {
    const newOrderDate = req.body.order_date; 
    const newOrderRefernce = req.body.order_reference; 
    const newCustomerId = req.params.customerId; 
    
    pool
    .query("SELECT * FROM customers WHERE id=$1", [newCustomerId])
    .then((result) => {
        if (result.rows.length > 0) {
            const query =
            "INSERT INTO orders (order_date, order_reference, customer_id) VALUES ($1, $2, $3)";
            pool
            .query(query, [newOrderDate, newOrderRefernce, newCustomerId])
            .then(() => res.send("Order created!"))
            .catch((e) => console.error(e));
        } else {
            return res
            .status(400)
            .send("The customer don't exists!");
        }
    })
})

/////////////////////////////////////////

///////////////TASK 07///////////////////
app.put('/customers/:customerId', function(req, res) {
    const updateName = req.body.name; 
    const updateAddress = req.body.address; 
    const updateCity = req.body.city; 
    const updateCountry = req.body.country; 
    const customerId = req.params.customerId; 
    
    pool.query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then(result => {
        if (result.rows.length > 0){
            const query =
            "UPDATE customers SET name=$1, address=$2, city=$3, country=$4 WHERE id=$5;";
            pool
            .query(query, [updateName, updateAddress, updateCity, updateCountry, customerId])
            .then(() => res.send("Customer update!"))
            .catch((e) => console.error(e));
        }
        else{
            return res
            .status(400)
            .send("The customer don't exists!");
        }
    })
})
/////////////////////////////////////////

///////////////TASK 08///////////////////
app.delete('/orders/:orderId', function(req, res) {
    const orderId = req.params.orderId;

    pool.query("SELECT * FROM orders WHERE id=$1", [orderId])
    .then(result => {
        if (result.rows.length > 0){
            const query =
            `DELETE FROM order_items where order_id = ${orderId};
            DELETE FROM orders where id = ${orderId}`;
            pool
            .query(query)
            .then(() => res.send("Order delete!"))
            .catch((e) => console.error(e));
        }
        else{
            return res
            .status(400)
            .send("The order don't exists!");
        }
    })
})
/////////////////////////////////////////

///////////////TASK 09///////////////////
app.delete('/customers/:customerId', function(req, res) {
    const customerId = req.params.customerId;

    pool.query("SELECT * FROM orders WHERE customer_id=$1", [customerId])
    .then(result => {
        if (result.rows.length > 0){
            return res
            .status(400)
            .send("The customer has one or more orders!");
        }
        else{
            pool
            .query(`DELETE FROM customers where id = ${customerId}`)
            .then(() => res.send("Customer delete!"))
            .catch((e) => console.error(e));
        }
    })
})
/////////////////////////////////////////

///////////////TASK 10///////////////////
app.get('/customers/:customerId/orders', (req, res) => {
    const customerId = req.params.customerId

    pool.query(
        `Select 
        customers.name, orders.order_reference, orders.order_date, products.product_name, products.unit_price, suppliers.supplier_name, order_items.quantity 
            from order_items 
        inner join
            orders on order_items.order_id = orders.id
        inner join
            customers on orders.customer_id = customers.id
        inner join
            products on order_items.product_id = products.id
        inner join
            suppliers on products.supplier_id = suppliers.id
        where customers.id = ${customerId}`, (error, result) => {
            res.json(result.rows);
    });
})
/////////////////////////////////////////

///////////////////////////////////////////////////////////////////


const port = 3000
app.listen(port, () => {
    console.log(`server listening on port ${port}: http://localhost:${port}`);
})
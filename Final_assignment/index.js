const http = require('http');
const fs = require('fs');
var path = require ('path');
var favicon = require('serve-favicon');

const hostname = '127.0.0.1';
const port = 3100;
const url = require('url');

const { render } = require('ejs');
const express = require('express')
const flash = require('express-flash')
const session = require('express-session');
const exp = require('constants');
const app = express();

const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"shopping_cart"
});

//set view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(
    session({
      secret: '123@123abc',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
    }),
  );
app.use(flash());

//set css
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req,res){
    con.query('SELECT * FROM products', (err, results) => {
        if(err) throw err;
        res.render('pages/index', {product: results});
    });
});

//add to cart
app.post('/cart/add/:pdid', function(req, res) {
  // Get the product ID from the URL parameter
  let pdid = req.params.pdid;

  // Get the product details from the database using the ID
  let sql = " Select * FROM products WHERE id = ?";
  con.query(sql, [pdid], function(err, result) {
    if (err) throw err;

    // Check if the product is already in the cart
    let cartSql = "SELECT * FROM cart WHERE product_id = ?";
    con.query(cartSql, [pdid], function(err, cartResult) {
      if (err) throw err;

      if (cartResult.length > 0) {
        // If the product is already in the cart, update the quantity
        let updateSql = "UPDATE cart SET qty = qty + 1 WHERE product_id = ?";
        con.query(updateSql, [pdid], function(err, updateResult) {
          if (err) throw err;

        });
      } else {
        // If the product is not in the cart, insert it with a quantity of 1
        let insertSql = "INSERT INTO cart (product_id, productname, productprice, qty) VALUES (?, ?, ?, ?)";
        con.query(insertSql, [result[0].id, result[0].product_name, result[0].product_price, 1], function(err, insertResult) {
          if (err) throw err;

        });
      }
    });
  });
});

//------------payment---------
app.post('/cart/payment', function(req, res) {
  // Remove all items from the cart in your database
  con.query('DELETE FROM cart', function(error, results) {
    if (error) throw error;

    res.json({ success: true });
  });
});

//-------------load cart

app.get('/about', function(req,res){
  res.render('pages/about');
});

app.get('/cart', function(req, res) {
  let cartSql = "SELECT c.*, p.product_img FROM cart c,products p where c.product_id=p.id";
  
  let cartParams = [];

  con.query(cartSql, cartParams, function(err, cartResult) {
    if (err) throw err;

    // Render the cart page with the cart items and count
    res.render('pages/cart', {
      cartItems: cartResult,
      cartCount: cartResult.length
    });
  });
});

app.get('/product/:id', (req, res) => {
    const id = req.params.id;
  
    // Use MySQL query to get the product with the given ID
    con.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
      if (err) {
        // Handle error
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (results.length === 0) {
        // Handle case where no product was found with the given ID
        res.status(404).send('Product not found');
        return;
      }
  
      // Render the product detail template with the product data
      const product = results[0];
      res.render('pages/detail', { product });
    });
  });
  
console.log('--incomming request--');

//--------------Cart-Count--------
app.get('/cart/count', (req, res) => {
  con.query('SELECT COUNT(*) AS count FROM cart', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving cart count');
    } else {
      // Send the count as JSON
      res.json({ count: result[0].count });
    }
  });
});

//---------------remove-----------
app.post('/cart/remove/:pdid', (req, res) => {
    const pdid = req.params.pdid;

    // Delete the item from the database
    con.query('DELETE FROM cart WHERE product_id = ?', [pdid], (err, results) => {
    if (err) throw err;
    res.redirect('/cart');
  });
});

//const dt = require('../NodeJS/datemodule');
app.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});
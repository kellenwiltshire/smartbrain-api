const e = require('express');
const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const knex = require('knex');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
	client: 'pg',
	connection: {
		host: 'process.env.DATABASE_URL',
		ssl: true,
	},
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('success');
});

//! SIGN IN FUNTION
app.post('/signin', (req, res) => {
	signin.handleSignIn(req, res, db, bcrypt);
});

//! REGISTER FUNCTION
app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt, saltRounds);
});

//! PROFILE FUNTIONS
app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db);
});
app.delete('/profile/:id', (req, res) => {
	profile.handleProfileDelete(req, res, db);
});

//!IMAGE FUNCTION
app.put('/image', (req, res) => {
	image.handleImage(req, res, db);
});
app.post('/imageurl', (req, res) => {
	image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`'app is running on port ${process.env.PORT}`);
});

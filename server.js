const e = require('express');
const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'kellenw',
        database: 'smartbraindb'
    }
})

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success')
})

//! SIGN IN FUNTION
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials');
            } 
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

//! REGISTER FUNCTION
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]) 
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
})

//! PROFILE FUNTION
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users')
    .where({id})
    .then(user => {
        if(user.length){
            res.json(user[0])
        } else {
            res.status(400).json('not found')
        }
    })
    .catch(err => res.status(400).json('Error getting user'))
})

app.delete('/profile/:id', (req, res) => {
    const { id, email } = req.body;
    db.select('*').from('users')
    .where({id})
    .del()
    .catch(err => res.status(400).json('Error Deleting User'))

    db.select('*').from('login')
    .where({email})
    .del()
    .catch(err => res.status(400).json('Error Deleting User'))
})

//!IMAGE FUNCTION
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('Unable to get entries'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})
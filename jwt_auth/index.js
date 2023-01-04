const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const AUTHORIZATION_HEADER = 'Authorization';

app.use((req, res, next) => {
    const token = req.get(AUTHORIZATION_HEADER);

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
            if (err) {
                console.log("Invalid JWT token:", token);
                return;
            }
            const user = users.find(user => user.login == payload.login);
            req.username = user.username;
            console.log("JWT token verified: ", token);
        })
    }

    next()
});

app.get('/', (req, res) => {
    if (req.username) {
        return res.json({
            username: req.username,
            logout: 'http://localhost:3000/logout'
        })
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    },
    {
        login: 'VolodymyrPienskoi',
        password: 'p4ssw0rd',
        username: 'Volodymyr Pienskoi',
    }
]

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        if (user.login == login && user.password == password) {
            return true;
        }
        return false;
    });

    if (user) {
        console.log("Successful login: ", login)
        const token = jwt.sign(
            { login: user.login },
            process.env.TOKEN_SECRET,
            { expiresIn: '3m' }
        );
        res.json(token);
    } else {
        console.log("Unsuccessful login: ", login);
    }

    res.status(401).send();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

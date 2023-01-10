const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { getUserToken, getUser, getAccessToken, createUser, refreshAccessToken, getCertificate } = require('./auth_service');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const AUTHORIZATION_HEADER = 'Authorization';
const { domain, client_id, client_secret, audience } = process.env;

const getKey = (header, callback) => {
    getCertificate(domain).then(cert => callback(null, cert));
}

app.use((req, res, next) => {
    const token = req.get(AUTHORIZATION_HEADER);
    req.token = token;

    if (token) {
        jwt.verify(token, getKey, { audience: audience, issuer: `https://${domain}/` }, (err, payload) => {
            if (err) {
                console.log("Invalid JWT token:", token);
                res.status(401).send();
                return;
            }

            console.log("JWT token verified: ", token);
            req.userId = payload.sub;
            next();
        })
    } else {
        next();
    }
});

app.get('/', async (req, res) => {
    if (req.userId) {
        const user = await getUser(domain, req.token, req.userId);
        return res.json({
            username: user.name,
            logout: 'http://localhost:3000/logout'
        });
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userToken = await getUserToken(domain, email, password, client_id, client_secret, audience);
        console.log("Successful login: ", email)
        res.json(userToken);
    } catch (err) {
        console.log("Unsuccessful login: ", email);
    }

    res.status(401).send();
});

app.post('/api/signup', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const token = await getAccessToken(domain, client_id, client_secret, audience);
        const user = await createUser(domain, token.access_token, email, name, password);
        console.log("User created successfully: ", email)
        res.status(201).json(user);
    } catch (err) {
        const msg = err.message;
        if (msg === '400 Bad Request') {
            console.log(`Error creating user ${email}: Password is too weak`);
            res.status(400).send('Password is too weak');
        } else if (msg === '409 Conflict') {
            console.log(`Error creating user ${email}: The user already exists`);
            res.status(409).send('The user already exists');
        }
    }

    res.status(500).send();
});

app.post('/api/refresh_token', async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const token = await refreshAccessToken(domain, refreshToken, client_id, client_secret)
        console.log('Refreshed token with ', refreshToken);
        res.json(token);
    } catch (err) {}

    res.status(400).send();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

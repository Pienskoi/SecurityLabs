const request = require("request");

const getUserToken = (domain, email, password, clientId, clientSecret, audience) => new Promise((resolve, reject) => {
    const options = { 
        method: 'POST',
        url: `https://${domain}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            'username': email,
            'password': password,
            'client_id': clientId,
            'client_secret': clientSecret,
            'audience': audience,
            'grant_type': 'http://auth0.com/oauth/grant-type/password-realm',
            'realm': 'Username-Password-Authentication',
            'scope': 'offline_access'
        }
    };

    request(options, (error, response, body) => {
        if (error) reject(new Error(error));
        if (response.statusCode != 200) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }
        
        try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (err) {
            reject(err);
        }
    });
})

const getUser = (domain, token, userId) => new Promise((resolve, reject) => {
    const options = {
        method: 'GET',
        url: `https://${domain}/api/v2/users/${userId}`,
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    };

    request(options, (error, response, body) => {
        if (error) reject(new Error(error));
        if (response.statusCode != 200) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }
        
        try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (err) {
            reject(err);
        }
    });
})

const getAccessToken = (domain, clientId, clientSecret, audience) => new Promise((resolve, reject) => {
    const options = { 
        method: 'POST',
        url: `https://${domain}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            'client_id': clientId,
            'client_secret': clientSecret,
            'audience': audience,
            'grant_type': 'client_credentials' 
        }
    };

    request(options, (error, response, body) => {
        if (error) reject(new Error(error));
        if (response.statusCode != 200) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }
        
        try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (err) {
            reject(err);
        }
    });
})

const createUser = (domain, token, email, name, password) => new Promise((resolve, reject) => {
    const options = {
        method: 'POST',
        url: `https://${domain}/api/v2/users`,
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            'email': email,
            'name': name,
            'password': password,
            'connection': 'Username-Password-Authentication'
        })
    };

    request(options, (error, response, body) => {
        if (error) reject(new Error(error));
        if (response.statusCode != 201) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }
        
        try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (err) {
            reject(err);
        }
    });
})

const refreshAccessToken = (domain, token, clientId, clientSecret) => new Promise((resolve, reject) => {
    const options = { 
        method: 'POST',
        url: `https://${domain}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            'client_id': clientId,
            'client_secret': clientSecret,
            'grant_type': 'refresh_token' ,
            'refresh_token': token
        }
    };

    request(options, (error, response, body) => {
        if (error) reject(new Error(error));
        if (response.statusCode != 200) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }
        
        try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (err) {
            reject(err);
        }
    });
})

const getCertificate = domain => new Promise((resolve, reject) => {
    const options = { 
        method: 'GET',
        url: `https://${domain}/pem`
    };

    request(options, (error, response, body) => {
        if (error) reject(new Error(error));
        if (response.statusCode != 200) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }
        
        resolve(body);
    });
})

const getTokenByCode = (domain, code, clientId, clientSecret) => new Promise((resolve, reject) => {
    const options = { 
        method: 'POST',
        url: `https://${domain}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            'grant_type': 'authorization_code',
            'client_id': clientId,
            'client_secret': clientSecret,
            'code': code,
            'redirect_uri': 'http://localhost:3000'
        }
    };

    request(options, (error, response, body) => {
        if (error) reject(new Error(error));
        if (response.statusCode != 200) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }
        
        try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (err) {
            reject(err);
        }
    });
})

module.exports = { getUserToken, getUser, getAccessToken, createUser, refreshAccessToken, getCertificate, getTokenByCode };

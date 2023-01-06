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

module.exports = { getUserToken };

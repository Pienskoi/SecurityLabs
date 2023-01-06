const request = require("request");

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

module.exports = { refreshAccessToken };

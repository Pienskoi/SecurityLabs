const request = require("request");

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

module.exports = { createUser };

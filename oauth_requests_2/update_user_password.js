const request = require("request");

const updateUserPassword = (domain, token, userId, password) => new Promise((resolve, reject) => {
    const options = {
        method: 'PATCH',
        url: `https://${domain}/api/v2/users/${userId}`,
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            'password': password,
            'connection': 'Username-Password-Authentication'
        })
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

module.exports = { updateUserPassword };

const request = require("request");

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

module.exports = { getUser };

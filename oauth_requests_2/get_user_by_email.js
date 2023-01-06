const request = require("request");

const getUserByEmail = (domain, token, email) => new Promise((resolve, reject) => {
    const options = {
        method: 'GET',
        url: `https://${domain}/api/v2/users-by-email?email=${email}`,
        headers: {
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
            resolve(parsedBody[0]);
        } catch (err) {
            reject(err);
        }
    });
})

module.exports = { getUserByEmail };

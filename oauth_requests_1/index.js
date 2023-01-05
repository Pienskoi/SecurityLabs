const { getAccessToken } = require('./get_access_token');
const { createUser } = require('./create_user');
const { getUser } = require('./get_user');
const kpiAppConfig = require('./kpi_app_config');
const ownAppConfig = require('./own_app_config');

const sendRequests = async config => {
    const { domain, clientId, clientSecret, audience } = config;
    const email = 'john.doe@gmail.com';
    const name = 'JohnDoe';
    const password = 'P4ssw0rd';

    const token = await getAccessToken(domain, clientId, clientSecret, audience);
    console.log('Отримання токену через client_credential grant:');
    console.log(token);
    const accessToken = token.access_token;

    const user = await createUser(domain, accessToken, email, name, password);
    console.log('Створення юзера з власним email в системі:');
    console.log(user);
    const userId = user.user_id;
    console.log('Знаходження юзера в системі за допомогою його унікального Id:');
    console.log(await getUser(domain, accessToken, userId));
}

const main = async () => {
    console.log('Запити до kpi.eu.auth0.com application:');
    await sendRequests(kpiAppConfig);
    console.log('Запити до власного створеного application:');
    await sendRequests(ownAppConfig);
};
main();

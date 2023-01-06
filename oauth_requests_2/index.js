const { getUserToken } = require('./get_user_token');
const { refreshAccessToken } = require('./refresh_access_token');
const { getAccessToken } = require('./get_access_token');
const { getUserByEmail } = require('./get_user_by_email');
const { updateUserPassword } = require('./update_user_password');
const { getUser } = require('./get_user');
const kpiAppConfig = require('./kpi_app_config');
const ownAppConfig = require('./own_app_config');

const sendRequests = async config => {
    const { domain, clientId, clientSecret, audience } = config;
    const email = 'john.doe@gmail.com';
    const password = 'P4ssw0rd';
    const newPassword = 'NewP4ssw0rd';

    const userToken = await getUserToken(domain, email, password, clientId, clientSecret, audience);
    console.log('Отримання user token:');
    console.log(userToken);
    const refreshToken = userToken.refresh_token;
    console.log('Отримання оновленого токену використовуючи refresh-token grant:');
    console.log(await refreshAccessToken(domain, refreshToken, clientId, clientSecret));

    const token = await getAccessToken(domain, clientId, clientSecret, audience);
    console.log('Отримання токену через client_credential grant:');
    console.log(token);
    const accessToken = token.access_token;
    const user = await getUserByEmail(domain, accessToken, email);
    console.log('Знаходження юзера в системі за допомогою його email:');
    console.log(user);
    const userId = user.user_id;
    try {
        console.log('Зміна пароля юзера:');
        console.log(await updateUserPassword(domain, accessToken, userId, newPassword));
        console.log('Знаходження юзера в системі за допомогою його унікального Id (для перевірки операції зміни паролю):');
        console.log(await getUser(domain, accessToken, userId));
    } catch (err) {
        console.log('Отримано помилку через нестачу прав:');
        console.log(err.message);
    }

}

const main = async () => {
    console.log('Запити до kpi.eu.auth0.com application:');
    await sendRequests(kpiAppConfig);
    console.log('Запити до власного створеного application:');
    await sendRequests(ownAppConfig);
};
main();

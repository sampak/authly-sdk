import Authy from '../dist/index';

const authy = new Authy();

(async () => {
    await authy.init();
    await authy.createUser({
        email: 'example@example.com',
        login: 'example',
        password: 'Example'
    })
})()
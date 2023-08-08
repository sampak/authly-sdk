import Authy from '../dist/index';

const authy = new Authy();

(async () => {
    await authy.init();
    await authy.loginUser({
        email: 'example@example.com',
        password: 'Example'
    })
})()
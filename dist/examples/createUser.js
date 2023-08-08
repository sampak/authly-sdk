"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../dist/index");
const authy = new index_1.default();
(async () => {
    await authy.init();
    await authy.createUser({
        email: 'example@example.com',
        login: 'example',
        password: 'Example'
    });
})();
//# sourceMappingURL=createUser.js.map
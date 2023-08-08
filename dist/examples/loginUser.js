"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../dist/index");
const authy = new index_1.default();
(async () => {
    await authy.init();
    await authy.loginUser({
        email: 'example@example.com',
        password: 'Example'
    });
})();
//# sourceMappingURL=loginUser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptMessage = void 0;
const openpgp = require("openpgp");
const encryptMessage = async (message, key) => {
    try {
        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: message }),
            encryptionKeys: await openpgp.readKey({ armoredKey: key })
        });
        return encrypted;
    }
    catch (e) {
        console.log("Cannot encrypt message");
        return null;
    }
};
exports.encryptMessage = encryptMessage;
//# sourceMappingURL=utils.js.map
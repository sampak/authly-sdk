"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const openpgp = require("openpgp");
const fs = require("fs");
const utils_1 = require("./utils");
class Authy {
    constructor() {
        this.requestInterceptor = async (config) => {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${await this.getToken()}`;
            return config;
        };
        fs.readFile('cert/public_key.pub', (err, data) => {
            if (err)
                throw new Error('Missing public key, public_key.pub is in the cert folder?');
            this.publicKey = data.toString();
        });
        this.axiosInstance = axios_1.default.create({
            baseURL: 'http://localhost:3000',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.axiosInstance.interceptors.request.use(this.requestInterceptor);
    }
    async getToken() {
        return this.token;
    }
    async loginUser(payload) {
        const encryptedPassword = await (0, utils_1.encryptMessage)(payload.password, this.publicKey);
        if (!encryptedPassword) {
            console.log("Cannot login user, missing encrypted password.");
        }
        try {
            const response = await this.axiosInstance.post("/auth/login", {
                email: payload.email,
                password: encryptedPassword
            });
            console.log(response);
            return response.data;
        }
        catch (e) {
            throw new Error(e?.response?.data?.message ?? 'UNKNOW_ERROR');
        }
    }
    async createUser(payload) {
        const encryptedPassword = await (0, utils_1.encryptMessage)(payload.password, this.publicKey);
        if (!encryptedPassword) {
            console.log("Cannot create user, missing encrypted password.");
        }
        try {
            const response = await this.axiosInstance.post("/users ", {
                login: payload.login,
                email: payload.email,
                password: encryptedPassword,
            });
            return response.data;
        }
        catch (e) {
            throw new Error(e?.response?.data?.message ?? 'UNKNOW_ERROR');
        }
    }
    async init() {
        const response = await axios_1.default.post('http://localhost:3000/hosts/init');
        if (response.data) {
            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: response.data }),
                encryptionKeys: await openpgp.readKey({ armoredKey: this.publicKey })
            });
            const solved = await axios_1.default.post('http://localhost:3000/hosts/task', {
                solved: encrypted,
            });
            if (!solved.data.token)
                throw new Error('Cannot get JWT token probably solution was wrong');
            this.token = solved.data.token;
        }
    }
}
exports.default = Authy;
//# sourceMappingURL=index.js.map
import axios, { AxiosInstance } from 'axios';
import * as openpgp from 'openpgp'
import * as fs from 'fs';
import { IRequestCreateUser } from './dto/requests/IRequestCreateUser';
import { encryptMessage } from './utils';
import { IRequestLoginUser } from './dto/requests/IRequestLoginUser';

class Authly {
  private token: string;
  private publicKey: string;
  private axiosInstance: AxiosInstance

  constructor() {
    fs.readFile('cert/public_key.pub', (err, data) => {
      if(err) throw new Error('Missing public key, public_key.pub is in the cert folder?')
      this.publicKey = data.toString();
    })

    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json'
      }
    });


    this.axiosInstance.interceptors.request.use(this.requestInterceptor);
  }



  // Privated methods

  private async getToken() {
    return this.token;
  }


  // Public Methods 
  
  public async loginUser(payload: IRequestLoginUser) {
    const encryptedPassword = await encryptMessage(payload.password, this.publicKey);

    if(!encryptedPassword) {
      console.log("Cannot login user, missing encrypted password.");
    }


    try {
      const response = await this.axiosInstance.post("/auth/login", {
        email: payload.email,
        password: encryptedPassword
      }) 

      console.log(response);

      return response.data;
    } catch(e) {
      throw new Error(e?.response?.data?.message ?? 'UNKNOW_ERROR');
    }
  }

  public async createUser(payload: IRequestCreateUser) {
    const encryptedPassword = await encryptMessage(payload.password, this.publicKey);
    
    if(!encryptedPassword) {
      console.log("Cannot create user, missing encrypted password.");
    }

    try {

      const response = await this.axiosInstance.post("/users ", {
        login: payload.login,
        email: payload.email,
        password: encryptedPassword,
        
      });
      
      
      
      return response.data;
    } catch(e) {
      throw new Error(e?.response?.data?.message ?? 'UNKNOW_ERROR')
    }
  }

  public async init() { // Initialize connection with authly service get and solve task and after that get Json Web Token
    const response = await axios.post('http://localhost:3000/hosts/init'); // Get task from authly
    if(response.data) {
      const encrypted = await openpgp.encrypt({ // Encrypt message by public key
        message: await openpgp.createMessage({ text: response.data }),
        encryptionKeys: await openpgp.readKey({ armoredKey: this.publicKey })
      })

      const solved = await axios.post('http://localhost:3000/hosts/task', { // Send task to validation
        solved: encrypted,
      })

      if(!solved.data.token) throw new Error('Cannot get JWT token probably solution was wrong')
      this.token = solved.data.token;
    }
  }


  // Interceptors 

  private requestInterceptor = async (config: any) => {
    if(!config.headers) {
      config.headers = {}
    }

    config.headers.Authorization = `Bearer ${await this.getToken()}`

    return config;
  }
}
  
export default Authy
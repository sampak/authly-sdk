import { IRequestCreateUser } from './dto/requests/IRequestCreateUser';
import { IRequestLoginUser } from './dto/requests/IRequestLoginUser';
declare class Authy {
    private token;
    private publicKey;
    private axiosInstance;
    constructor();
    private getToken;
    loginUser(payload: IRequestLoginUser): Promise<any>;
    createUser(payload: IRequestCreateUser): Promise<any>;
    init(): Promise<void>;
    private requestInterceptor;
}
export default Authy;

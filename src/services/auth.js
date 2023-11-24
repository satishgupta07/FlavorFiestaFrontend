import axios from "axios";
const URL = 'http://localhost:8000/api/v1';

export class AuthService {

    async createAccount(data) {
        try {
            return await axios.post(`${URL}/users/register`, data);
        } catch (error) {
            console.log('Error while registering user !!', error);
        }
    }

    async login(data) {
        try {
            return await axios.post(`${URL}/users/login`, data);
        } catch (error) {
            console.log('Error while login !!', error);
        }
    }
}

const authService = new AuthService();

export default authService
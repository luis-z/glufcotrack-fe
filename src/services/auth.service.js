require('dotenv').config()
import axios from 'axios';
import cookie from 'js-cookie'
import authHeader from './auth-header';

// const API_URL = 'http://3.88.239.123/api/';
const API_URL = process.env.VUE_APP_API

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password
      })
      .then(response => {

        if (response.data.data.access_token) {
          cookie.set('userToken', response.data.data.access_token);
          authHeader()
        }

        return response.data;
      })
      .catch(err => {
        throw new Error(err.response.data.data);
      });
  }

  userData () {
    return axios
      .post(API_URL + 'userdata')
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw new Error(err.response.data.data);
      });
  }

  logout() {
    cookie.remove('userToken');
  }

  register(user) {
    return axios.post(API_URL + 'register', {
      name: user.nombre,
      email: user.email,
      password: user.password,
      telefono: user.numtelefono,
      apellido: user.apellido,
      tipodocumento: user.tipodocumento,
      num_identificacion: user.num_identificacion,
    });
  }
}

export default new AuthService();

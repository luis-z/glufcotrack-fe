import axios from 'axios';
import cookie from 'js-cookie'

const API_URL = 'http://3.88.239.123/api/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password
      })
      .then(response => {

        if (response.data.code == 8) {
          return
        }
        if (response.data.data.access_token) {
          cookie.set('userToken', response.data.data.access_token);

        }

        return response.data;
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

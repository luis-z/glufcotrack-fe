import cookie from 'js-cookie'
import axios from 'axios';

export default function authHeader() {
  let user = cookie.get('userToken');

  if (user) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + user
    return { Authorization: 'Bearer ' + user }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    axios.defaults.headers.common['Authorization'] = null
    return {};
  }
}

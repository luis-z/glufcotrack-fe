import cookie from 'js-cookie'

export default function authHeader() {
  let user = cookie.get('userToken');
  console.log('user test :>> ', user);

  if (user) {
    return { Authorization: 'Bearer ' + user }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}

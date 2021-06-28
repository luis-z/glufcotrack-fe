import AuthService from '../services/auth.service';
import cookie from 'js-cookie'

const initialState = () => {
  const userInfo = cookie.get('userData');

  if (userInfo) {
    let formatted = JSON.parse(userInfo)
    return { status: { loggedIn: true }, user: formatted, }
  } else {
    return { status: { loggedIn: false }, user: null, }
  }
}

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess');
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    userData({ commit }) {
      console.log(Date.now());
      return AuthService.userData().then(
        userData => {
          commit('userDataSuccess', userData);
          return Promise.resolve(userData);
        },
        error => {
          AuthService.logout();
          commit('logout');
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state) {
      state.status.loggedIn = true;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    userDataSuccess(state, userData) {
      state.user = userData;
    }
  }
};

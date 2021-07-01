import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import CreateOrden from "../views/CreateOrden.vue";
import Ubicacion from "../views/Ubicacion.vue";
import store from '../store'

Vue.use(VueRouter);

const cliente = (to, from, next) => {

  let currentUser = store.state.auth.user

  if (!currentUser) next({ name: 'Login' })

  if (!currentUser.email_verificado) next({ name: 'Home' })

  if (!currentUser.celular.verificado) next({ name: 'Home' })

  next()
}

const routes = [
  {
    path: "/inicio",
    name: "Home",
    component: Home,
    // beforeEnter: cliente
  },
  {
    path: "/neworden",
    name: "NewOrden",
    component: CreateOrden
  },
  {
    path: "/ubicacion",
    name: "Ubicacion",
    component: Ubicacion,
    beforeEnter: cliente
  },
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/registro",
    name: "Register",
    component: Register
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

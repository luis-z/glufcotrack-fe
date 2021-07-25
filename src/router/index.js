import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import OrdenesUsuario from '../views/User/Ordenes.vue'
import OrdenesTrabajador from '../views/Trabajador/Ordenes.vue'
import Ubicacion from '../views/User/Ubicacion.vue'
import store from '../store'

Vue.use(VueRouter)

const cliente = (to, from, next) => {
  const currentUser = store.state.auth.user

  if (!currentUser) next({ name: 'Login' })

  if (currentUser.rol === 2) next({ name: 'OrdenesTrabajador' })

  if (to.name !== 'OrdenesUsuario') {
  
    if (!currentUser.email_verificado) next({ name: 'OrdenesUsuario' })
  
    if (!currentUser.celular.verificado) next({ name: 'OrdenesUsuario' })
  
    else next()
  } else {
    next()
  }
}

const trabajador = (to, from, next) => {
  const currentUser = store.state.auth.user

  if (!currentUser) next({ name: 'Login' })

  if (currentUser.rol === 3) next({ name: 'OrdenesUsuario' })

  else next()
}

const routes = [
  {
    path: '/ordenes',
    name: 'OrdenesUsuario',
    component: OrdenesUsuario,
    beforeEnter: cliente
  },
  {
    path: '/trabajador/ordenes',
    name: 'OrdenesTrabajador',
    component: OrdenesTrabajador,
    beforeEnter: trabajador
  },
  {
    path: '/ubicacion',
    name: 'Ubicacion',
    component: Ubicacion,
    beforeEnter: cliente
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/registro',
    name: 'Register',
    component: Register
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Home from '../components/layout/Home.vue'
import PageNotFound from '../components/layout/404.vue'
import Unauthorized from '../components/layout/401.vue'
import BookCreate from '../views/book/Create.vue'
import BookIndex from '../views/book/Index.vue'
import BookEdit from '../views/book/Edit.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: Home,
    children: [
      // book route
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/dashboard/Index.vue')
      },
      {
        path: 'book',
        name: 'book.index',
        component: BookIndex
      },
      {
        path: 'book/create',
        name: 'book.create',
        component: BookCreate
      },
      {
        path: 'book/edit/:id',
        name: 'book.edit',
        component: BookEdit,
        params: true
      },
      {
        path: 'book/view/:id',
        name: 'book.view',
        component: () => import('../views/book/View.vue')
      },

      // kategori route
      {
        path: 'category',
        name: 'category.index',
        component: () => import('../views/category/Index.vue'),
      },
      {
        path: 'category/create',
        name: 'category.create',
        component: () => import('../views/category/Create.vue'),
      },
      {
        path: 'category/edit/:id',
        name: 'category.edit',
        component: () => import('../views/category/Edit.vue'),
        params: true
      },
      {
        path: 'category/view/:id',
        name: 'category.view',
        component: () => import('../views/category/View.vue')
      },

      //Peminjaman Route
      {
        path: 'peminjaman',
        name: 'peminjaman.index',
        component: () => import('../views/peminjaman/Index.vue'),
      },
      {
        path: 'peminjaman/view/:id',
        name: 'peminjaman.view',
        component: () => import('../views/peminjaman/View.vue')
      },

      //List Member
      {
        path: 'member',
        name: 'member.index',
        component: () => import('../views/member/Index.vue'),
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('../components/layout/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../components/layout/Register.vue')
  },

  //404 page not found
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: Unauthorized
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  var authenticated = localStorage.getItem('token')
  var role = localStorage.getItem('role')
  if (to.name !== 'login' && to.name !== 'register' && !authenticated) {
    next({
      name: 'login'
    })
  }
  if (to.name === 'register' && !authenticated) {
    next()
  }
  if (to.name === 'login' && authenticated && authenticated != '') {
    next({
      name: 'dashboard'
    })
  }
  if (to.name === 'register' && authenticated && authenticated != '') {
    next({
      name: 'dashboard'
    })
  }
  if (to.name === 'book.create' && role !== 'admin')
    next({
      name: 'unauthorized'
    })
  if (to.name === 'book.edit' && role !== 'admin')
    next({
      name: 'unauthorized'
    })
  if (to.name === 'category.index' && role !== 'admin')
    next({
      name: 'unauthorized'
    })
  if (to.name === 'category.create' && role !== 'admin')
    next({
      name: 'unauthorized'
    })
  if (to.name === 'category.edit' && role !== 'admin')
    next({
      name: 'unauthorized'
    })
  if (to.name === 'member.index' && role !== 'admin')
    next({
      name: 'unauthorized'
    })
  next()
})

export default router
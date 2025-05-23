import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'gallery',
          component: () => import('../views/GalleryView.vue')
        },
        {
          path: 'album',
          name: 'album',
          component: () => import('../views/AlbumView.vue')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('../views/SearchView.vue')
        },
        {
          path: 'editor',
          name: 'editor',
          component: () => import('../views/EditorView.vue')
        },
        {
          path: 'batch-edit',
          name: 'batchEdit',
          component: () => import('../views/BatchEditView.vue')
        },
        {
          path: 'annotation',
          name: 'annotation',
          component: () => import('../views/AnnotationView.vue')
        },
        {
          path: 'new',
          name: 'new',
          component: () => import('../views/NewView.vue')
        }
      ]
    },

  ]
})

export default router 
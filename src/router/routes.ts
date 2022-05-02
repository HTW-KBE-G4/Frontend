import { RouteRecordRaw } from 'vue-router';

const MainLayout = () => import('layouts/MainLayout.vue');
const ProductsPage = () => import('pages/ProductsPage.vue');
const ComponentsPage = () => import('src/pages/ComponentsPage.vue');
const AboutPage = () => import('pages/AboutPage.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'products',
        alias: '/',
        component: ProductsPage,
        /*children: [
          {
            path: 'id',
            component: DetailedProductView,
          },
        ]*/
      },
      {
        path: 'components',
        component: ComponentsPage,
      },
      {
        path: 'about',
        component: AboutPage,
      },
      // TODO: add /products/create, /products/details/{id}, components/details/{id} paths
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

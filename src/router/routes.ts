import { RouteRecordRaw } from 'vue-router';

const MainLayout = () => import('layouts/MainLayout.vue');
const ProductsPage = () => import('pages/ProductsPage.vue');
const ComponentsPage = () => import('src/pages/ComponentsPage.vue');
const AboutPage = () => import('pages/AboutPage.vue');
const DetailedProduct = () => import('components/DetailedProduct.vue');
const DetailedComponent = () => import('components/DetailedComponent.vue');
const CreateProductDialog = () => import('components/CreateProductDialog.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'products',
        alias: '/',
        component: ProductsPage,
        children: [
          {
            path: 'create',
            component: CreateProductDialog,
          },
        ],
      },
      {
        path: 'products/:product_id',
        component: DetailedProduct,
        children: [
          {
            path: 'components/:component_id',
            component: DetailedComponent,
          },
        ],
      },
      {
        path: 'components',
        component: ComponentsPage,
        children: [
          {
            path: ':component_id',
            component: DetailedComponent,
          },
        ],
      },
      {
        path: 'about',
        component: AboutPage,
      },
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

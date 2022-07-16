import { boot } from 'quasar/wrappers';
import VueKeyCloak from '@dsb-norge/vue-keycloak-js';
import { AxiosRequestConfig } from 'axios';
import { api } from './axios';
import { VueKeycloakInstance } from '@dsb-norge/vue-keycloak-js/dist/types';

export default boot(async ({ app }) => {
  async function tokenInterceptor() {
    api.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        config.headers[
          'Authorization'
        ] = `Bearer ${app.config.globalProperties.$keycloak.token}`;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    ); //null, { synchronous: true })
  }

  return new Promise((resolve) => {
    app.use(VueKeyCloak, {
      init: {
        onLoad: 'login-required', // or 'check-sso'
        flow: 'standard',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
      },
      config: {
        url: 'http://localhost:8080/auth',
        realm: 'Tanuki-Realm',
        clientId: 'frontend-client',
      },
      onReady: () => {
        tokenInterceptor();
        resolve();
      },
    });
  });
});

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keycloak: VueKeycloakInstance;
  }
}

/// <reference path="LoginModule.ts" />

module FifaLeagueClient.Module.Login {

    loginModule.service('authInterceptorService', ['$q', '$injector', function initService($q, $injector){
            return new AuthInterceptorService($q, $injector);
        }])
        .config([
            '$httpProvider',
            ($httpProvider) => $httpProvider.interceptors.push('authInterceptorService')
        ]);

    export class AuthInterceptorService {

        qService: ng.IQService;
        injector;

        constructor($q: ng.IQService, injector) {
            this.qService = $q;
            this.injector = injector;
        }

        // handle request
        public request = (config) => {

            config.headers = config.headers || {};

            var authData = this.injector.get('sessionStorageService').getObjectSession(SessionStorageService.authorizationTokenKey);
            if (authData) {
                config.headers.Authorization = authData;
            }

            return config;
        }

        // Handle Request error redirect to the login page if no auth although go to a page describing the error
        public responseError = (rejection) => {
            var authData = this.injector.get('sessionStorageService').getObjectSession(SessionStorageService.authorizationTokenKey);
            if (rejection.status === 401 && authData) {
                this.injector.get('$location').path(unauthorizedPath);
            }
            else if (rejection.status === 401) {
                this.injector.get('$location').path(loginPath);
            }
            return this.qService.reject(rejection);
        }

    }
}

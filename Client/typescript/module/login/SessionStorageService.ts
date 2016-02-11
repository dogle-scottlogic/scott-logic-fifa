module FifaLeagueClient.Module.Login {

    loginModule.config([
            'localStorageServiceProvider',
            (localStorageServiceProvider) => localStorageServiceProvider.setStorageType('sessionStorage')
        ])
        .factory(loginDataSessionService, ['$injector', function initService($injector){
            var sessionStorageService = new SessionStorageService($injector);
            return sessionStorageService;
        }])

    // service used to store in session some variables
    export class SessionStorageService {

        public static authorizationTokenKey = "authorizationTokenKey";
        public static userID = "userID";
        public static loginData = "loginData";

        localStorageService;

        public constructor(injector) {
            this.localStorageService = injector.get('localStorageService');
        }

        public getObjectSession = (cacheID : string ) : Object => {
            return this.localStorageService.get(cacheID);
        }

        public setObjectSession = (cacheID : string, value : Object) =>{
            return this.localStorageService.set(cacheID, value);
        }
    }

}

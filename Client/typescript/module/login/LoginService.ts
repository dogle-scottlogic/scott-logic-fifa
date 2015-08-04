// Service used to manage the login on the web api server
// use a localStorage in order to remember the authenticationToken
module FifaLeagueClient.Module.Login {

    loginModule.factory('loginService', ['$http', '$q', loginDataSessionService, FifaLeagueClient.Module.Common.configService,
    ($http, $q, loginDataSessionService, config)=>
            new LoginService($http, $q, loginDataSessionService, config)
        ])

    export class LoginService {
        httpService: ng.IHttpService;
        qService: ng.IQService;
        localStorageService: SessionStorageService;

        // URL used to reach the league API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService",
            '$q',
            'localStorageService'
        ];

        constructor($http: ng.IHttpService,
                    $q: ng.IQService,
                    localStorageService: SessionStorageService,
                    config: Common.Config) {
            this.httpService = $http;
            this.qService = $q;
            this.localStorageService = localStorageService;
            this.apiURL = config.backend+"api/Authentication";
            this.apiURLWithSlash = this.apiURL+"/";
        }

        private make_base_auth(user, password) : string {
          var tok = user + ':' + password;
          var hash = btoa(tok);
          return "Basic " + hash;
        }

        public login(loginData:AuthenticationModel) : ng.IPromise<boolean> {
            var self = this;
            var data = self.make_base_auth(loginData.userName, loginData.password);
            var deferred = this.qService.defer();

            this.httpService.get(this.apiURL, { headers: { 'Authorization': data } })
                .success(function (data, status, headers, config) {
                    self.successLogin(data, config);
                    deferred.resolve(true);
                })
                .error(function (data, status, headers, config) {
                    self.logOut();
                    deferred.reject(config);
                });

            return deferred.promise;

        }

        // Login in means store the token header in session
        public successLogin(data, config){
            // we store the token in the service
            this.localStorageService.setObjectSession(SessionStorageService.authorizationTokenKey, config.headers.Authorization);
            this.localStorageService.setObjectSession(SessionStorageService.userID, data.ID);
            this.localStorageService.setObjectSession(SessionStorageService.loginData, data);
        }

        // Login out means drop the token header stored in session
        public logOut() {
            this.localStorageService.setObjectSession(SessionStorageService.authorizationTokenKey, null);
            this.localStorageService.setObjectSession(SessionStorageService.userID, null);
            this.localStorageService.setObjectSession(SessionStorageService.loginData, null);
        }
    }
}

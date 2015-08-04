/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Login {

    export class LoginController extends Common.Controllers.AbstractController  {

        mainService:LoginService;
        loginData:AuthenticationModel;
        location;

        static $inject = [
            "$scope", 'loginService', '$location'
        ];

        constructor(scope, loginService : LoginService, location) {
            super(scope);
            this.mainService = loginService;
            this.loginData = new AuthenticationModel();
            this.location = location;
        }

        public login = () => {
          var self =  this;
    			this.errors = {};
    				this.mainService.logout();

          // After the logout, we login
    			this.loadingPromise = this.mainService.login(this.loginData)
  					.then(this.handleSuccess)
            .catch(this.handleErrors);
        };

        // Do nothing if the creation is successfull
        protected handleSuccess = (response:boolean) => {
            this.loginData.isAuth = response;
            this.location.path("/");
        }

        // Method adding creating errors in creatingErrors list
        protected handleErrors = (config) => {
            this.loginData.isAuth = false;
            this.errors = config.errors;
        }

        public logout = () => {
            this.mainService.logout();
        };

    }

}

/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Login {

    export class LoginController extends Common.Controllers.AbstractController  {

        mainService:LoginService;

        loginData:AuthenticationModel;

        static $inject = [
            "$scope", 'loginService'
        ];

        constructor(scope, loginService : LoginService) {
            super(scope);
            this.mainService = loginService;
            this.loginData = new AuthenticationModel();
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

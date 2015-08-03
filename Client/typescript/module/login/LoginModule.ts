module FifaLeagueClient.Module.Login {

  export const moduleName = 'login';

  /**
   * String constant to refer to the login service.
   * @type {string}
   */
  export const loginDataSessionService = 'sessionStorageService';


  /**
   * Module managing the connection
   */
  export var loginModule = angular.module(moduleName,['LocalStorageModule', 'ui.bootstrap', 'cgBusy', 'ngRoute']);

  export var loginPath = "/login";
  export var unauthorizedPath = "/unauthorized";
  export var logoutPath = "/logout";

  loginModule.config(["$routeProvider",
  function routes($routeProvider: ng.route.IRouteProvider){

      $routeProvider.when(loginPath, {
        templateUrl: 'views/login/login.html',
        controller: LoginController,
        controllerAs: 'vm'
      }),
      $routeProvider.when(unauthorizedPath, {
        templateUrl: './views/Login/unauthorized.html'
      }),
      $routeProvider.when(logoutPath, {
        templateUrl: './views/Login/logout.html',
        controller: LoginController,
        controllerAs: 'vm'
      })


    }]);

}

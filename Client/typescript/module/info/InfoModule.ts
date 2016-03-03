module FifaLeagueClient.Module.Info {
  export const moduleName = 'info';

  export var infoModule = angular.module(moduleName, ['ui.bootstrap', 'cgBusy','ngRoute']);

  export const infoPath = '/info';

  infoModule.config(["$routeProvider",
  function routes($routeProvider: ng.route.IRouteProvider){

      $routeProvider.when(infoPath, {
        templateUrl: 'views/info/info.html'
      })

    }]);

}

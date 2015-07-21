module FifaLeagueClient.Module.Dashboard {
  export const moduleName = 'dashboard';

  export var dashboardModule = angular.module(moduleName, ['ui.bootstrap', 'cgBusy','ngRoute']);

  export const dashboardPath = '/dashboard';

  dashboardModule.config(["$routeProvider",
  function routes($routeProvider: ng.route.IRouteProvider){

      $routeProvider.when('/', {
        templateUrl: 'views/dashboard/dashboard.html',
        controller: DashboardShowController,
        controllerAs: 'vm'
      })
      .when(dashboardPath, {
        templateUrl: 'views/dashboard/dashboard.html',
        controller: DashboardShowController,
        controllerAs: 'vm'
      })

    }]);

}

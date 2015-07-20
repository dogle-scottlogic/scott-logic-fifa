module FifaLeagueClient.Module.Season {
  export const moduleName = 'season';

  export var seasonModule = angular.module(moduleName, ['ui.bootstrap','ngRoute']);

  export const seasonsPath = '/seasons';
  export const seasonsAddPath = seasonsPath+'/add';
  export const seasonsEditPath = seasonsPath+'/edit/:id';

  seasonModule.config(["$routeProvider",
  function routes($routeProvider: ng.route.IRouteProvider){

      $routeProvider.when(seasonsPath, {
        templateUrl: 'views/season/seasons.html',
        controller: SeasonListController,
        controllerAs: 'vm'
        })
      .when(seasonsAddPath, {
          templateUrl: 'views/season/season-add.html',
          controller: SeasonAddController,
          controllerAs: 'vm'
        })
      .when(seasonsEditPath, {
          templateUrl: 'views/season/season-edit.html',
          controller: SeasonEditController,
          controllerAs: 'vm'
      });

    }]);


}

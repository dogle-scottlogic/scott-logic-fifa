module FifaLeagueClient.Module.Player {
  export const moduleName = 'player';

  export var playerModule = angular.module(moduleName, ['ui.bootstrap', 'cgBusy','ngRoute']);

  export const playersPath = '/players';
  export const playersAddPath = playersPath+'/add';
  export const playersEditPath = playersPath+'/edit/:id';

  playerModule.config(["$routeProvider",
  function routes($routeProvider: ng.route.IRouteProvider){

      $routeProvider
        .when(playersPath, {
          templateUrl: 'views/player/players.html',
          controller: PlayerListController,
          controllerAs: 'vm'
        })
        .when(playersAddPath, {
            templateUrl: 'views/player/player-add.html',
            controller: PlayerAddController,
            controllerAs: 'vm'
          })
        .when(playersEditPath, {
            templateUrl: 'views/player/player-edit.html',
            controller: PlayerEditController,
            controllerAs: 'vm'
        });

    }]);
}

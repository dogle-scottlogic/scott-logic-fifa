/// <reference path="../../typings/tsd.d.ts"/>

/// <reference path="module/common/services/Config.ts" />
/// <reference path="module/common/services/HTTPErrorInterceptorService.ts" />
/// <reference path="module/country/CountryModule.ts" />
/// <reference path="module/player/PlayerModule.ts" />
/// <reference path="module/season/SeasonModule.ts" />
/// <reference path="module/league/LeagueModule.ts" />

module FifaLeagueClient {
    export var mainModule = angular.module("FifaLeagueApp", ['ngRoute',
        Module.Common.HTTPErrorHandleModuleName, Module.Common.devConfig,
        Module.Country.moduleName, Module.Season.moduleName, Module.Player.moduleName, Module.League.moduleName
    ])
    .config(["$routeProvider",
    function routes($routeProvider: ng.route.IRouteProvider){
      $routeProvider.when('/', {
          templateUrl: 'views/partials/dashboard.html'
        })
        .when('/countries', {
          templateUrl: 'views/countries.html',
          controller: Module.Country.CountryController,
          controllerAs: 'vm'
        })
        .when('/seasons', {
          templateUrl: 'views/seasons.html',
          controller: Module.Season.SeasonController,
          controllerAs: 'vm'
        })
        .when('/players', {
          templateUrl: 'views/players.html',
          controller: Module.Player.PlayerController,
          controllerAs: 'vm'
        })
        .when('/leaguewizard', {
          template: '<leaguewizard></leaguewizard'
        });
    }]);

    // Adding the default template for the busy message
    angular.module('FifaLeagueApp').value('cgBusyDefaults',{
        templateUrl:'views/partials/busy-template.html'
    });
}

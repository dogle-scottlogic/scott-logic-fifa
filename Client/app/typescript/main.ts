/// <reference path="../../typings/tsd.d.ts"/>

/// <reference path="module/country/CountryModule.ts" />
module FifaLeagueClient {
    angular.module("FifaLeagueApp", ['ngRoute',
      Module.Country.moduleName
    ]).config(["$routeProvider",
    function routes($routeProvider: ng.route.IRouteProvider){
      $routeProvider.when('/', {
          templateUrl: '../views/partials/dashboard.html'
        }).when('/countries', {
          templateUrl: '../views/countries.html',
          controller: FifaLeagueClient.Module.Country.Controllers.CountryController
        });
    }]);
}

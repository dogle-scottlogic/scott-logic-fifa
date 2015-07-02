/// <reference path="../../typings/tsd.d.ts"/>

/// <reference path="module/common/services/Config.ts" />
/// <reference path="module/common/services/HTTPErrorInterceptorService.ts" />
/// <reference path="module/country/CountryModule.ts" />

module FifaLeagueClient {
    export var mainModule = angular.module("FifaLeagueApp", ['ngRoute',
        Module.Common.HTTPErrorHandleModuleName, Module.Common.devConfig, Module.Country.moduleName
    ]).config(["$routeProvider",
    function routes($routeProvider: ng.route.IRouteProvider){
      $routeProvider.when('/', {
          templateUrl: '../views/partials/dashboard.html'
        }).when('/countries', {
          templateUrl: '../views/countries.html',
          controller: Module.Country.CountryController,
          controllerAs: 'vm'
        });
    }]);
}

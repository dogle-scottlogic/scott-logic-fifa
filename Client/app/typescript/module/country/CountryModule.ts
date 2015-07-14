module FifaLeagueClient.Module.Country {
  export const moduleName = 'country';

  export var countryModule = angular.module(moduleName, ['ui.bootstrap', 'cgBusy','ngRoute']);

  export const countriesPath = '/countries';
  export const countriesAddPath = countriesPath+'/add';
  export const countriesEditPath = countriesPath+'/edit/:id';

  countryModule.config(["$routeProvider",
  function routes($routeProvider: ng.route.IRouteProvider){

      $routeProvider.when(countriesPath, {
        templateUrl: 'views/country/countries.html',
        controller: CountryListController,
        controllerAs: 'vm'
      })
      .when(countriesAddPath, {
          templateUrl: 'views/country/country-add.html',
          controller: CountryAddController,
          controllerAs: 'vm'
        })
      .when(countriesEditPath, {
          templateUrl: 'views/country/country-edit.html',
          controller: CountryEditController,
          controllerAs: 'vm'
      });

    }]);

}

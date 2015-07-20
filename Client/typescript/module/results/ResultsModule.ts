module FifaLeagueClient.Module.Results {
	export const moduleName = 'results';

  	export var resultsModule = angular.module(moduleName, ['ui.bootstrap', 'cgBusy','ngRoute']);


	  resultsModule.config(["$routeProvider",
	  function routes($routeProvider: ng.route.IRouteProvider){

	      $routeProvider.when('/view-result', {
	        templateUrl: 'views/results/result-view-show.html',
	        controller: ResultViewShowController,
	        controllerAs: 'vm'
	      })
				.when('/view-fixture', {
	        templateUrl: 'views/results/fixture-view-show.html',
	        controller: FixtureViewShowController,
	        controllerAs: 'vm'
	      });

	    }]);
}

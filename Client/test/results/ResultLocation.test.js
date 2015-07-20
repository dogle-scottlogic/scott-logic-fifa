describe('Testing the results locations', function() {
  beforeEach(module('FifaLeagueApp'));
  // load the template
  beforeEach(module('templates'));

  var resultViewService = {};
  var countryService = {};
  var seasonService = {};
  var location, rootScope, compile;
  var route;
  var defer;

  // Mocking the result view service
  beforeEach(function() {

    module(function($provide) {
        // Fake seasonService Implementation returning a promise
        $provide.value('resultViewService', resultViewService);
        $provide.value('countryService', countryService);
        $provide.value('seasonService', seasonService);
      });

      // defining the method getResultViewFilteredList for the service used by the controller
      resultViewService.getResultViewFilteredList = function(filter){
      }

      countryService.getCountryList = function(){
      }

      seasonService.getSeasonFilteredList = function(filter){
      }


  });

    // getting all we need for the tests
  beforeEach(inject(function ($location, $rootScope, $route, $compile, $q) {

    location = $location;
    rootScope = $rootScope;
    route= $route;
    compile=$compile;
    defer = $q.defer();
  }));


  describe('Testing the result location : ', function(){

    it('Location /view-result shall link to views/results/result-view-show.html and FifaLeagueClient.Module.Results.ResultViewShowController', function() {

      // moving to the location /players
      location.path('/view-result');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /players
      expect(location.path()).toBe('/view-result');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Results.ResultViewShowController);
      expect(route.current.templateUrl).toEqual('views/results/result-view-show.html');
    });

    it('Location /view-result shall call resultViewService.getResultViewFilteredList() in order to init the list', function() {

      // Spying the playerService for the method getPlayerList which will return a promise
      spyOn(resultViewService, 'getResultViewFilteredList').and.returnValue(defer.promise);
      spyOn(countryService, 'getCountryList').and.returnValue(defer.promise);
      spyOn(seasonService, 'getSeasonFilteredList').and.returnValue(defer.promise);
      // Creating a fake view in order to have then the location diplayed in this
      var html = angular.element('<ng-view></ng-view>');
      var element = compile(html)(rootScope.$new());

      // moving to the location /players
      location.path('/view-result');
      rootScope.$apply();
      rootScope.$digest();

      // Verfiying that on init the getPlayerList of the service is called
      expect(resultViewService.getResultViewFilteredList).toHaveBeenCalled();
      expect(countryService.getCountryList).toHaveBeenCalled();
      expect(seasonService.getSeasonFilteredList).toHaveBeenCalled();
    });

  });


});

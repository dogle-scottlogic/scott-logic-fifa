describe('Testing the season locations', function() {
  beforeEach(module('FifaLeagueApp'));
  beforeEach(module('season'));
  // load the template
  beforeEach(module('templates'));

  var seasonService = {};
  var countryService = {};
  var location, rootScope, compile;
  var route;
  var defer;

  // Mocking the season service
  beforeEach(function() {

    module(function($provide) {
        // Fake seasonService Implementation returning a promise
        $provide.value('seasonService', seasonService);
            // Fake seasonService Implementation returning a promise
        $provide.value('countryService', countryService);
      });
      // defining the method getSeasonList for the service used by the controller
      seasonService.getSeasonList = function(){
      }

      countryService.getCountryList = function(){

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


  describe('Testing the season location : ', function(){

    it('Location /seasons shall link to views/seasons.html and FifaLeagueClient.Module.Season.SeasonController', function() {

      // moving to the location /seasons
      location.path('/seasons');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /seasons
      expect(location.path()).toBe('/seasons');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Season.SeasonController);
      expect(route.current.templateUrl).toEqual('views/seasons.html');
    });

    it('Location /seasons shall call seasonService.getSeasonList() in order to init the list', function() {

      // Spying the seasonService for the method getSeasonList which will return a promise
      spyOn(seasonService, 'getSeasonList').and.returnValue(defer.promise);

      // Spying the countryService for the method getSeasonList which will return a promise
      spyOn(countryService, 'getCountryList').and.returnValue(defer.promise);
      // Creating a fake view in order to have then the location diplayed in this
      var html = angular.element('<ng-view></ng-view>');
      var element = compile(html)(rootScope.$new());

      // moving to the location /seasons
      location.path('/seasons');
      rootScope.$apply();
      rootScope.$digest();

      // Verfiying that on init the getSeasonList of the service is called
      expect(seasonService.getSeasonList).toHaveBeenCalled();

      // Verfiying that on init the getCountryList of the service is called
      expect(countryService.getCountryList).toHaveBeenCalled();
    });

  });


});

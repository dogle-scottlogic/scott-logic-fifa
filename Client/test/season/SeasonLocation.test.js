describe('Testing the season locations', function() {
  beforeEach(module('FifaLeagueApp'));
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

      seasonService.getSeason = function(id){
      }

      countryService.getCountryFilteredList = function(){

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

    it('Location /seasons shall link to views/season/seasons.html and FifaLeagueClient.Module.Season.SeasonListController', function() {

      // moving to the location /seasons
      location.path('/seasons');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /seasons
      expect(location.path()).toBe('/seasons');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Season.SeasonListController);
      expect(route.current.templateUrl).toEqual('views/season/seasons.html');
    });

    it('Location /seasons shall call seasonService.getSeasonList() in order to init the list', function() {

      // Spying the seasonService for the method getSeasonList which will return a promise
      spyOn(seasonService, 'getSeasonList').and.returnValue(defer.promise);
      // Creating a fake view in order to have then the location diplayed in this
      var html = angular.element('<ng-view></ng-view>');
      var element = compile(html)(rootScope.$new());

      // moving to the location /seasons
      location.path('/seasons');
      rootScope.$apply();
      rootScope.$digest();

      // Verfiying that on init the getSeasonList of the service is called
      expect(seasonService.getSeasonList).toHaveBeenCalled();
    });

    it('Location /seasons/add shall link to views/season/season-add.html and FifaLeagueClient.Module.Season.SeasonAddController', function() {

      // moving to the location /seasons
      location.path('/seasons/add');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /seasons
      expect(location.path()).toBe('/seasons/add');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Season.SeasonAddController);
      expect(route.current.templateUrl).toEqual('views/season/season-add.html');
    });


    it('Location /seasons/edit/1 shall link to views/season/season-edit.html and FifaLeagueClient.Module.Season.SeasonEditController', function() {

      // moving to the location /seasons
      location.path('/seasons/edit/1');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /seasons
      expect(location.path()).toBe('/seasons/edit/1');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Season.SeasonEditController);
      expect(route.current.templateUrl).toEqual('views/season/season-edit.html');
    });

    it('Location /seasons/edit/1 shall call seasonService.getSeason() in order to init the season', function() {

      // Spying the seasonService for the method getSeasonList which will return a promise
      spyOn(seasonService, 'getSeason').and.returnValue(defer.promise);
      // Spying the countryService for the method getSeasonList which will return a promise
      spyOn(countryService, 'getCountryFilteredList').and.returnValue(defer.promise);

      // Creating a fake view in order to have then the location diplayed in this
      var html = angular.element('<ng-view></ng-view>');
      var element = compile(html)(rootScope.$new());

      // moving to the location /seasons
      location.path('/seasons/edit/1');
      rootScope.$apply();
      rootScope.$digest();

      // Verfiying that on init the getSeasonList of the service is called
      expect(seasonService.getSeason).toHaveBeenCalledWith('1');
      // Verfiying that on init the getCountryList of the service is called
      expect(countryService.getCountryFilteredList).toHaveBeenCalled();
    });

  });


});

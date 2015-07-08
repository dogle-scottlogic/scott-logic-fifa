describe('Testing the country locations', function() {
  beforeEach(module('FifaLeagueApp'));
  beforeEach(module('country'));
  // load the template
  beforeEach(module('templates'));

  var countryService = {};
  var location, rootScope, compile;
  var route;
  var defer;

  // Mocking the country service
  beforeEach(function() {

    module(function($provide) {
        // Fake seasonService Implementation returning a promise
        $provide.value('countryService', countryService);
      });
      // defining the method getCountryList for the service used by the controller
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


  describe('Testing the country location : ', function(){

    it('Location /countries shall link to views/countries.html and FifaLeagueClient.Module.Country.CountryController', function() {

      // moving to the location /countries
      location.path('/countries');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /countries
      expect(location.path()).toBe('/countries');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Country.CountryController);
      expect(route.current.templateUrl).toEqual('views/countries.html');
    });

    it('Location /countries shall call countryService.getCountryList() in order to init the list', function() {

      // Spying the countryService for the method getCountryList which will return a promise
      spyOn(countryService, 'getCountryList').and.returnValue(defer.promise);
      // Creating a fake view in order to have then the location diplayed in this
      var html = angular.element('<ng-view></ng-view>');
      var element = compile(html)(rootScope.$new());

      // moving to the location /countries
      location.path('/countries');
      rootScope.$apply();
      rootScope.$digest();

      // Verfiying that on init the getCountryList of the service is called
      expect(countryService.getCountryList).toHaveBeenCalled();
    });

  });


});

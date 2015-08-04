describe('Testing the login locations', function() {
  beforeEach(module(FifaLeagueClient.Module.Login.moduleName));
  // load the template
  beforeEach(module('templates'));

  var location, rootScope, compile;
  var route;
  var defer;
  var loginService = {};

  beforeEach(function() {

    module(function($provide) {
        // Fake loginService Implementation
        $provide.value('loginService', loginService);
      });

      loginService = jasmine.createSpyObj('loginService',['logout']);

      // getting all we need for the tests
      inject(function ($location, $rootScope, $route, $compile, $q) {
        location = $location;
        rootScope = $rootScope;
        route= $route;
        compile=$compile;
        defer = $q.defer();
      });

  });

  describe('Testing the login location : ', function(){

    it('Location /login shall link to views/login/login.html and FifaLeagueClient.Module.Login.LoginController', function() {
      location.path('/login');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /login
      expect(location.path()).toBe('/login');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Login.LoginController);
      expect(route.current.templateUrl).toEqual('views/login/login.html');
    });

    it('Location /unauthorized shall link to views/login/unauthorized.html', function() {
      location.path('/unauthorized');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /unauthorized
      expect(location.path()).toBe('/unauthorized');
      expect(route.current.templateUrl).toEqual('views/login/unauthorized.html');
    });


    it('Location /logout shall link to views/login/logout.html and FifaLeagueClient.Module.Login.LoginController', function() {
      location.path('/logout');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /unauthorized
      expect(location.path()).toBe('/logout');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Login.LoginController);
      expect(route.current.templateUrl).toEqual('views/login/logout.html');
    });

    it('Location /logout should call the logout method', function() {
      var html = angular.element('<ng-view></ng-view>');
      var element = compile(html)(rootScope.$new());
      location.path('/logout');
      rootScope.$apply();
      rootScope.$digest();
      // Verify that the logout of the service had been called
      expect(loginService.logout).toHaveBeenCalled();
    });

  });


});

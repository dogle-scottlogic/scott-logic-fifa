describe('Testing the AuthInterceptorService', function() {
  beforeEach(module(FifaLeagueClient.Module.Login.moduleName));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var authInterceptorService;
  var $httpBackend, $http, $location;
  var sessionStorageService = {};

  beforeEach(function() {

    module(function($provide) {
        // Fake sessionStorageService Implementation returning the header
        $provide.value('sessionStorageService', sessionStorageService);
      });

    sessionStorageService = jasmine.createSpyObj('sessionStorageService',['getObjectSession']);


    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $http = $injector.get('$http');
      $q = $injector.get('$q');
      $location = $injector.get('$location');

    });

  });

  // Getting the services
  beforeEach(inject(function(_authInterceptorService_) {
    authInterceptorService = _authInterceptorService_;
  }));


  describe('AuthInterceptorService : ', function(){

      it('Case auth null', function () {

        var authHeaderUsed="";
        // We call an url in order to have a get and see if the config file is correctly filled
        var url = "api/test/";
        $httpBackend.expectGET(url,function (data, status, headers, config){
          authHeaderUsed = data.Authorization;
          return true;
        }).respond(200,true);

        $http.get(url);
        $httpBackend.flush();
        // We expect that the authHeaderUsed = the authHeader
        expect(authHeaderUsed).toEqual(undefined);
      });

    it('Every requests should have the authorization header (if not null) ', function () {
      // we fake the authorization header
      var authHeaderUsed = "";
      var authHeader = "fake header";
      sessionStorageService.getObjectSession.and.returnValue(authHeader);
      // We call an url in order to have a get and see if the config file is correctly filled
      var url = "api/test/";

      $httpBackend.expectGET(url,function (data, status, headers, config){
        authHeaderUsed = data.Authorization;
        return true;
      }).respond(200,true);

      $http.get(url);
      $httpBackend.flush();
      // We expect that the authHeaderUsed = the authHeader
      expect(authHeaderUsed).toEqual(authHeader);
    });

    it('Case user authenticated but have an 401 error response - No change of path ', function () {
      // we fake the authorization header
      var previousUrl = $location.url();
      var authHeader = "fake header";
      sessionStorageService.getObjectSession.and.returnValue(authHeader);
      // We call an url in order to have a get and see if the config file is correctly filled
      var url = "api/test/";
      $httpBackend.expectGET(url).respond(401,{Message: 'Auth error'});
      $http.get(url);
      $httpBackend.flush();

      // We expect that the location shouldn't change
      expect($location.url()).toEqual(previousUrl);
    });


    it('Case user not authenticated and have an 401 error response - Change of path ', function () {
      // We call an url in order to have a get and see if the config file is correctly filled
      var url = "api/test/";
      $httpBackend.expectGET(url).respond(401,{Message: 'Auth error'});
      $http.get(url);
      $httpBackend.flush();

      // We expect that the location should change to the login page
      expect($location.url()).toEqual(FifaLeagueClient.Module.Login.loginPath);
    });


    it('Case user not authenticated and have an 500 error response - No change of path ', function () {
      var previousUrl = $location.url();
      // We call an url in order to have a get and see if the config file is correctly filled
      var url = "api/test/";
      $httpBackend.expectGET(url).respond(500,{Message: 'Error'});
      $http.get(url);
      $httpBackend.flush();

      // We expect that the location shouldn't change
      expect($location.url()).toEqual(previousUrl);
    });



  });


});

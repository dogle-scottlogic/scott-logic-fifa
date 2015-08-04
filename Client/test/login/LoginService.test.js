describe('Testing the LoginService', function() {
  beforeEach(module(FifaLeagueClient.Module.Login.moduleName));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var loginService;
  var $httpBackend, $http, $location;
  var sessionStorageService = {};

  beforeEach(function() {

    module(function($provide) {
        // Fake sessionStorageService Implementation returning the header
        $provide.value('sessionStorageService', sessionStorageService);
      });

      sessionStorageService.getObjectSession = function(authorizationTokenKey){
      }

      sessionStorageService.setObjectSession = function(authorizationTokenKey){
      }



    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

    });

  });

  // Getting the services
  beforeEach(inject(function(_loginService_) {
    loginService = _loginService_;
  }));


  describe('LoginService : ', function(){

      it('Verify that the user and password are sent', function () {

        spyOn(sessionStorageService, 'getObjectSession').and.returnValue(null);
        spyOn(sessionStorageService, 'setObjectSession').and.returnValue(null);

        var loginData = new FifaLeagueClient.Module.Login.AuthenticationModel();
        loginData.userName = "user";
        loginData.password = "password";

        var authHeaderUsed="";
        // We call an url in order to have a get and see if the config file is correctly filled
        $httpBackend.expectGET(FifaLeagueClient.Module.Login.apiURL,function (data, status, headers, config){
          authHeaderUsed = data.Authorization;
          return true;
        }).respond(200,true);
        loginService.login(loginData);

        $httpBackend.flush();
        // We expect that the authentication is correctly sent
        expect(authHeaderUsed).toEqual(loginService.make_base_auth(loginData.userName, loginData.password));
      });

      it('Case login worked', function () {

        spyOn(sessionStorageService, 'getObjectSession').and.returnValue(null);
        spyOn(sessionStorageService, 'setObjectSession').and.returnValue(null);

        var responseData = {ID : "a"};

        var loginData = new FifaLeagueClient.Module.Login.AuthenticationModel();
        loginData.userName = "user";
        loginData.password = "password";
        // We call an url in order to have a get and see if the config file is correctly filled
        $httpBackend.expectGET(FifaLeagueClient.Module.Login.apiURL).respond(200,responseData);
        loginService.login(loginData);


        this.localStorageService.setObjectSession(SessionStorageService.authorizationTokenKey, config.headers.Authorization);
        this.localStorageService.setObjectSession(SessionStorageService.userID, data.ID);
        this.localStorageService.setObjectSession(SessionStorageService.loginData, data);

        $httpBackend.flush();
        // We expect that the authentication has been correctly stored in session
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.authorizationTokenKey, loginService.make_base_auth(loginData.userName, loginData.password));
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.userID, responseData.ID);
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.loginData, responseData);
      });

  });


});

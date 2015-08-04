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

      sessionStorageService = jasmine.createSpyObj('sessionStorageService',['getObjectSession','setObjectSession']);

    // Mocking the datas
    inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

    });

  });

  // Getting the services
  beforeEach(inject(function(_loginService_) {
    loginService = _loginService_;
  }));


  describe('LoginService : ', function(){

      function createAuthenticationModel(){
          var loginData = new FifaLeagueClient.Module.Login.AuthenticationModel();
          loginData.userName = "user";
          loginData.password = "password";
          return loginData;
      }

      it('Verify that the user and password are sent', function () {
        var loginData = createAuthenticationModel();

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

      it('Case login success', function () {
        var responseData = {ID : "a"};

        loginData = createAuthenticationModel();
        // We call an url in order to have a get and see if the config file is correctly filled
        $httpBackend.expectGET(FifaLeagueClient.Module.Login.apiURL).respond(200,responseData);
        loginService.login(loginData);

        $httpBackend.flush();
        // We expect that the authentication has been correctly stored in session
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.authorizationTokenKey, loginService.make_base_auth(loginData.userName, loginData.password));
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.userID, responseData.ID);
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.loginData, responseData);
      });

      it('Case login failure', function () {
        var loginData = createAuthenticationModel();
        // We call an url in order to have a get and see if the config file is correctly filled
        $httpBackend.expectGET(FifaLeagueClient.Module.Login.apiURL).respond(500,"Error");
        loginService.login(loginData);

        $httpBackend.flush();
        // We expect that the authentication session has been correctly emptied
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.authorizationTokenKey, null);
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.userID, null);
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.loginData, null);
      });


      it('Case logout', function () {
        loginService.logout();

        // We expect that the authentication session has been correctly emptied
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.authorizationTokenKey, null);
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.userID, null);
        expect(sessionStorageService.setObjectSession).toHaveBeenCalledWith(FifaLeagueClient.Module.Login.SessionStorageService.loginData, null);
      });



  });


});

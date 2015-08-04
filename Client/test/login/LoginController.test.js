describe('Testing the LoginController', function() {
  beforeEach(module(FifaLeagueClient.Module.Login.moduleName));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var loginController;
  var loginService = {};
  var defer, rootScope;

  beforeEach(function() {

    module(function($provide) {
        // Fake loginService Implementation
        $provide.value('loginService', loginService);
      });

    loginService = jasmine.createSpyObj('loginService',['login','logout']);

    // Getting the dependencies
    inject(function($injector) {
      $q = $injector.get('$q');
      defer = $q.defer();
      rootScope = $injector.get('$rootScope');

    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    loginController = $controller(FifaLeagueClient.Module.Login.LoginController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('LoginController : ', function(){

      function createAuthenticationModel(){
          var loginData = new FifaLeagueClient.Module.Login.AuthenticationModel();
          loginData.userName = "user";
          loginData.password = "password";
          return loginData;
      }

      it('Verify that the user and password are sent to the service', function () {
        loginService.login.and.returnValue(defer.promise);
        // Setting the loginData
        loginController.loginData = createAuthenticationModel();
        loginController.login();
        // We expect that the service have been called with the loginData of the controller
        expect(loginService.logout).toHaveBeenCalled();
        expect(loginService.login).toHaveBeenCalledWith(loginController.loginData);
      });


      it('Login success', function () {
        defer.resolve(true);
        loginService.login.and.returnValue(defer.promise);
        // Setting the loginData
        loginController.loginData = createAuthenticationModel();
        loginController.login();
        verifyPromiseAndDigest(loginController, defer, rootScope);
        // We expect that the auth should be at true
        expect(loginController.loginData.isAuth).toEqual(true);
      });

      it('Login error', function () {
        defer.reject({errors:["Error"]});
        loginService.login.and.returnValue(defer.promise);
        // Setting the loginData
        loginController.loginData = createAuthenticationModel();
        loginController.login();
        verifyPromiseAndDigest(loginController, defer, rootScope);
        // We expect that the auth should be at false and have the error in the errors list
        expect(loginController.loginData.isAuth).toEqual(false);
        expect(loginController.errors).toContain("Error");
      });

  });

});

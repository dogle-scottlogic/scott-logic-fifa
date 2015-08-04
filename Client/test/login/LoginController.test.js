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

      loginService.login = function(data){
      }

      loginService.logout = function(){
      }

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

      it('Verify that the user and password are sent to the service', function () {

        spyOn(loginService, 'login').and.returnValue(defer.promise);
        spyOn(loginService, 'logout').and.returnValue(null);
        // Setting the loginData
        loginController.loginData.userName = "user";
        loginController.loginData.password = "password";
        loginController.login();

        // We expect that the service have been called with the loginData of the controller
        expect(loginService.logout).toHaveBeenCalled();
        expect(loginService.login).toHaveBeenCalledWith(loginController.loginData);
      });


      it('Login success', function () {
        defer.resolve(true);
        spyOn(loginService, 'login').and.returnValue(defer.promise);
        spyOn(loginService, 'logout').and.returnValue(null);
        // Setting the loginData
        loginController.loginData.userName = "user";
        loginController.loginData.password = "password";
        loginController.login();
        verifyPromiseAndDigest(loginController, defer, rootScope);
        // We expect that the auth should be at true
        expect(loginController.loginData.isAuth).toEqual(true);
      });

      it('Login error', function () {
        defer.reject({errors:["Error"]});
        spyOn(loginService, 'login').and.returnValue(defer.promise);
        spyOn(loginService, 'logout').and.returnValue(null);
        // Setting the loginData
        loginController.loginData.userName = "user";
        loginController.loginData.password = "password";
        loginController.login();
        verifyPromiseAndDigest(loginController, defer, rootScope);
        // We expect that the auth should be at false and have the error in the errors list
        expect(loginController.loginData.isAuth).toEqual(false);
        expect(loginController.errors).toContain("Error");
      });




  });


});

describe('Testing the UserAddController', function() {
  beforeEach(module(FifaLeagueClient.Module.User.moduleName));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var location;
  var userService = {};
  var defer, rootScope;

  beforeEach(function() {

    module(function($provide) {
        // Fake userService Implementation
        $provide.value('userService', userService);
      });

    userService = jasmine.createSpyObj('userService',['addUser', 'updateUser']);

    // Getting the dependencies
    inject(function($injector) {
      $q = $injector.get('$q');
      defer = $q.defer();
      rootScope = $injector.get('$rootScope');
      location = $injector.get('$location');

    });

  });

      var userAddController;

      // Constructing the controller
      beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();

        userAddController = $controller(FifaLeagueClient.Module.User.UserAddController,
            {$scope: scope});

        scope.$digest();
      }));

  describe('Add : ', function(){


      it('Verify if the confirm password fail', function () {
        userService.addUser.and.returnValue(defer.promise);
        userAddController.user = createFailurePasswordUser();
        userAddController.addUser();
        // We expect that the service not have been called because of the failure
        expect(userService.addUser).not.toHaveBeenCalled();
        expect(userAddController.errors["item.Password"]).not.toEqual(null);
      });


      it('Verify the user sent to the service', function () {
        userService.addUser.and.returnValue(defer.promise);
        userAddController.user = createCorrectUser();
        userAddController.addUser();
        // We expect that the service has been called
        expect(userService.addUser).toHaveBeenCalledWith(createCorrectUser());
      });


      it('Verify add done', function () {
        defer.resolve(null);
        userService.addUser.and.returnValue(defer.promise);
        userAddController.user = createCorrectUser();
        userAddController.addUser();
        verifyPromiseAndDigest(userAddController, defer, rootScope);
        // We expect the location should change to the list of users
        expect(location.path()).toBe('/users');
      });

      it('Verify add error', function () {
        defer.reject({errors:["Error"]});
        userService.addUser.and.returnValue(defer.promise);
        userAddController.user = createCorrectUser();
        userAddController.addUser();
        verifyPromiseAndDigest(userAddController, defer, rootScope);
        // We expect the error
        expect(userAddController.errors).toContain("Error");
      });


  });

});

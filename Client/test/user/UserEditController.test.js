describe('Testing the UserEditController', function() {
  beforeEach(module(FifaLeagueClient.Module.User.moduleName));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var $controller;
  var location;
  var userService = {};
  var defer, rootScope;

  beforeEach(function() {

    module(function($provide) {
        // Fake userService Implementation
        $provide.value('userService', userService);
      });

    userService = jasmine.createSpyObj('userService',['getUser', 'updateUser']);

    // Getting the dependencies
    inject(function($injector) {
      $q = $injector.get('$q');
      defer = $q.defer();
      rootScope = $injector.get('$rootScope');
      location = $injector.get('$location');
      $controller = $injector.get('$controller');

    });

  });

    var userEditController;

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();

      userEditController = $controller(FifaLeagueClient.Module.User.UserEditController,
          {$scope: scope});

      scope.$digest();
    }));


    describe('Init controller : ', function(){

          it('Verify if the Id is passed to the constructor that we try to load the user with this id', function () {
            userService.getUser.and.returnValue(defer.promise);
            var controller = $controller(FifaLeagueClient.Module.User.UserEditController,
                {$scope: scope, $routeParams: {id: 1}});
            scope.$digest();
            // We expect that the service has been called with the user id
            expect(controller.id).toEqual(1);
            expect(userService.getUser).toHaveBeenCalledWith(1);
          });

          it('Verify if the Id is null to the constructor that we don t try to load the user', function () {
            userService.getUser.and.returnValue(defer.promise);
            var controller = $controller(FifaLeagueClient.Module.User.UserEditController,
                {$scope: scope, $routeParams: {id: null}});
            scope.$digest();
            // We expect that the service has been called with the user id
            expect(controller.id).toEqual(null);
            expect(userService.getUser).not.toHaveBeenCalled();
          });

    });

    describe('Load the user : ', function(){

        it('Verify the Id is sent to the service', function () {
          userService.getUser.and.returnValue(defer.promise);
          userEditController.id = 1;
          userEditController.loadUser();
          // We expect that the service has been called with the user id
          expect(userService.getUser).toHaveBeenCalledWith(1);
        });


        it('Verify getUser ok', function () {
          defer.resolve(createCorrectUser());
          userService.getUser.and.returnValue(defer.promise);
          userEditController.id = 1;
          userEditController.loadUser();
          verifyPromiseAndDigest(userEditController, defer, rootScope);
          // We expect the location should change to the list of users
          expect(userEditController.user).toEqual(createCorrectUser());
        });

        it('Verify getUser error', function () {
          defer.reject({errors:["Error"]});
          userService.getUser.and.returnValue(defer.promise);
          userEditController.id = 1;
          userEditController.loadUser();
          verifyPromiseAndDigest(userEditController, defer, rootScope);
          // We expect the error
          expect(userEditController.errors).toContain("Error");
        });

    });

  describe('Update the user : ', function(){

      it('Verify if the confirm password fail', function () {
        userService.updateUser.and.returnValue(defer.promise);
        userEditController.user = createFailurePasswordUser();
        userEditController.updateUser();
        // We expect that the service not have been called because of the failure
        expect(userService.updateUser).not.toHaveBeenCalled();
        expect(userEditController.errors["item.Password"]).not.toEqual(null);
      });


      it('Verify the user sent to the service', function () {
        userService.updateUser.and.returnValue(defer.promise);
        userEditController.user = createCorrectUser();
        userEditController.updateUser();
        // We expect that the service has been called
        expect(userService.updateUser).toHaveBeenCalledWith(createCorrectUser());
      });


      it('Verify edit done', function () {
        defer.resolve(null);
        userService.updateUser.and.returnValue(defer.promise);
        userEditController.user = createCorrectUser();
        userEditController.updateUser();
        verifyPromiseAndDigest(userEditController, defer, rootScope);
        // We expect the location should change to the list of users
        expect(location.path()).toBe('/users');
      });

      it('Verify edit error', function () {
        defer.reject({errors:["Error"]});
        userService.updateUser.and.returnValue(defer.promise);
        userEditController.user = createCorrectUser();
        userEditController.updateUser();
        verifyPromiseAndDigest(userEditController, defer, rootScope);
        // We expect the error
        expect(userEditController.errors).toContain("Error");
      });

  });

});

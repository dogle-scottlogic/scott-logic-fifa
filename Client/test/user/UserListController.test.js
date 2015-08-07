describe('Testing the UserListController', function() {
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

    userService = jasmine.createSpyObj('userService',['getUserList', 'deleteUser']);

    // Getting the dependencies
    inject(function($injector) {
      $q = $injector.get('$q');
      defer = $q.defer();
      rootScope = $injector.get('$rootScope');
      location = $injector.get('$location');
      $controller = $injector.get('$controller');

    });

  });

    var userListController;

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();

      userListController = $controller(FifaLeagueClient.Module.User.UserListController,
          {$scope: scope});

      scope.$digest();
    }));

    describe('Load the user list : ', function(){

        it('Verify call of the service', function () {
          userService.getUserList.and.returnValue(defer.promise);
          userListController.getUserList();
          expect(userService.getUserList).toHaveBeenCalled();
        });


        it('Verify getUserList ok', function () {
          defer.resolve(createUserList());
          userService.getUserList.and.returnValue(defer.promise);
          userListController.getUserList();
          verifyPromiseAndDigest(userListController, defer, rootScope);
          expect(userListController.users).toEqual(createUserList());
        });

        it('Verify getUserList error', function () {
          defer.reject({errors:["Error"]});
          userService.getUserList.and.returnValue(defer.promise);
          userListController.getUserList();
          verifyPromiseAndDigest(userListController, defer, rootScope);
          // We expect the error
          expect(userListController.errors).toContain("Error");
        });

    });

  describe('Delete the user : ', function(){

      it('Verify the id sent to the service', function () {
        userService.deleteUser.and.returnValue(defer.promise);
        userListController.deleteUser(1);
        // We expect that the service has been called
        expect(userService.deleteUser).toHaveBeenCalledWith(1);
      });


      it('Verify delete done', function () {
        spyOn(userListController,'getUserList');
        defer.resolve(null);
        userService.deleteUser.and.returnValue(defer.promise);
        userListController.user = createCorrectUser();
        userListController.deleteUser(1);
        verifyPromiseAndDigest(userListController, defer, rootScope);
        expect(userListController.getUserList).toHaveBeenCalled();
      });

      it('Verify delete error', function () {
        defer.reject({errors:["Error"]});
        userService.deleteUser.and.returnValue(defer.promise);
        userListController.user = createCorrectUser();
        userListController.deleteUser(1);
        verifyPromiseAndDigest(userListController, defer, rootScope);
        // We expect the error
        expect(userListController.errors).toContain("Error");
      });

  });

});

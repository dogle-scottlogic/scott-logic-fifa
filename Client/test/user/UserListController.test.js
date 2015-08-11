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

        userService = jasmine.createSpyObj('userService',['getList', 'delete']);

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
        })
    );

    describe('Load the user list : ', function(){

        it('Verify call of the service', function () {
            userService.getList.and.returnValue(defer.promise);
            userListController.getUserList();
            expect(userService.getList).toHaveBeenCalled();
        });


        it('Verify getList ok', function () {
            defer.resolve(createUserList());
            userService.getList.and.returnValue(defer.promise);
            userListController.getUserList();
            verifyPromiseAndDigest(userListController, defer, rootScope);
            expect(userListController.users).toEqual(createUserList());
        });

        it('Verify getList error', function () {
            defer.reject({errors:["Error"]});
            userService.getList.and.returnValue(defer.promise);
            userListController.getUserList();
            verifyPromiseAndDigest(userListController, defer, rootScope);
            // We expect the error
            expect(userListController.errors).toContain("Error");
        });

    });

    describe('Delete the user : ', function(){

        it('Verify the id sent to the service', function () {
            userService.delete.and.returnValue(defer.promise);
            userListController.deleteUser(1);
            // We expect that the service has been called
            expect(userService.delete).toHaveBeenCalledWith(1);
        });


        it('Verify delete done', function () {
            spyOn(userListController,'getUserList');
            defer.resolve(null);
            userService.delete.and.returnValue(defer.promise);
            userListController.user = createCorrectUser();
            userListController.deleteUser(1);
            verifyPromiseAndDigest(userListController, defer, rootScope);
            expect(userListController.getUserList).toHaveBeenCalled();
        });

        it('Verify delete error', function () {
            defer.reject({errors:["Error"]});
            userService.delete.and.returnValue(defer.promise);
            userListController.user = createCorrectUser();
            userListController.deleteUser(1);
            verifyPromiseAndDigest(userListController, defer, rootScope);
            // We expect the error
            expect(userListController.errors).toContain("Error");
        });

    });

});

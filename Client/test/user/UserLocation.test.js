describe('Testing the user locations', function() {
    beforeEach(module('FifaLeagueApp'));
    // load the template
    beforeEach(module('templates'));

    var userService = {};
    var location, rootScope, compile;
    var route;
    var defer;

    // Mocking the user service
    beforeEach(function() {

        module(function($provide) {
            // Fake seasonService Implementation returning a promise
            $provide.value('userService', userService);
        });
        // defining the method getList for the service used by the controller
        userService.getList = function(){
        }

        userService.get = function(id){
        }

    });

    // getting all we need for the tests
    beforeEach(inject(function ($location, $rootScope, $route, $compile, $q) {

        location = $location;
        rootScope = $rootScope;
        route= $route;
        compile=$compile;
        defer = $q.defer();
    }));


    describe('Testing the user location : ', function(){

        it('Location /users shall link to views/user/users.html and FifaLeagueClient.Module.User.UserListController', function() {

            // moving to the location /users
            location.path('/users');
            rootScope.$apply();
            rootScope.$digest();

            // Verifying the definition of the URL /users
            expect(location.path()).toBe('/users');
            expect(route.current.controller).toBe(FifaLeagueClient.Module.User.UserListController);
            expect(route.current.templateUrl).toEqual('views/user/users.html');
        });

        it('Location /users shall call userService.getList() in order to init the list', function() {

            // Spying the userService for the method getList which will return a promise
            spyOn(userService, 'getList').and.returnValue(defer.promise);
            // Creating a fake view in order to have then the location diplayed in this
            var html = angular.element('<ng-view></ng-view>');
            var element = compile(html)(rootScope.$new());

            // moving to the location /users
            location.path('/users');
            rootScope.$apply();
            rootScope.$digest();

            // Verfiying that on init the getList of the service is called
            expect(userService.getList).toHaveBeenCalled();
        });

        it('Location /users/add shall link to views/user/user-add.html and FifaLeagueClient.Module.User.UserAddController', function() {

            // moving to the location /users
            location.path('/users/add');
            rootScope.$apply();
            rootScope.$digest();

            // Verifying the definition of the URL /users
            expect(location.path()).toBe('/users/add');
            expect(route.current.controller).toBe(FifaLeagueClient.Module.User.UserAddController);
            expect(route.current.templateUrl).toEqual('views/user/user-add.html');
        });


        it('Location /users/edit/1 shall link to views/user/user-edit.html and FifaLeagueClient.Module.User.UserEditController', function() {

            // moving to the location /users
            location.path('/users/edit/1');
            rootScope.$apply();
            rootScope.$digest();

            // Verifying the definition of the URL /users
            expect(location.path()).toBe('/users/edit/1');
            expect(route.current.controller).toBe(FifaLeagueClient.Module.User.UserEditController);
            expect(route.current.templateUrl).toEqual('views/user/user-edit.html');
        });

        it('Location /users/edit/1 shall call userService.get() in order to init the user', function() {

            // Spying the userService for the method getList which will return a promise
            spyOn(userService, 'get').and.returnValue(defer.promise);
            // Creating a fake view in order to have then the location diplayed in this
            var html = angular.element('<ng-view></ng-view>');
            var element = compile(html)(rootScope.$new());

            // moving to the location /users
            location.path('/users/edit/1');
            rootScope.$apply();
            rootScope.$digest();

            // Verfiying that on init the getList of the service is called
            expect(userService.get).toHaveBeenCalledWith('1');
        });

    });

});

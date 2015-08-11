describe('Testing the UserService', function() {
    beforeEach(module(FifaLeagueClient.Module.User.moduleName));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var userService;
    var $httpBackend, $http, $location;

    beforeEach(function() {

        // Mocking the datas
        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $q = $injector.get('$q');
        });

    });

    // Getting the services
    beforeEach(inject(function(_userService_) {
        userService = _userService_;
    }));

    function createUserFilter() {
        var userFilter = new FifaLeagueClient.Module.User.UserFilter();
        userFilter.Name = "Jack";
        return userFilter;
    }


    describe('getList : ', function(){

        it('retrieve the list', function () {
            var data;
            $httpBackend.expectGET(/\/api\/User\/*/).respond(200,createUserList());
            userService.getList().then(function(dataReturned){
                data = dataReturned;
            });
            $httpBackend.flush();
            expect(data).toEqual(createUserList());
        });

        it('respond an error', function () {
            var error;
            $httpBackend.expectGET(/\/api\/User\/*/).respond(500,{Message: "Error"});
            userService.getList().catch(function(errorReturned){
                error = errorReturned.errors;
            });
            $httpBackend.flush();
            expect(error["item.Global"]).toContain("Error");
        });

    });

    describe('getFilteredList : ', function(){

        it('retrieve the filtered list', function () {
            var filter = createUserFilter();
            var param = filter.getParameters("");
            var url = new RegExp('\\' + param);
            var data;
            $httpBackend.expectGET(url).respond(200,createUserList());
            userService.getFilteredList(filter).then(function(dataReturned){
                data = dataReturned;
            });
            $httpBackend.flush();
            expect(data).toEqual(createUserList());
        });

        it('respond an error', function () {
            var filter = createUserFilter();
            var param = filter.getParameters("");
            var url = new RegExp('\\' + param);
            var data;
            $httpBackend.expectGET(url).respond(500,{Message: "Error"});
            userService.getFilteredList(filter).catch(function(errorReturned){
                error = errorReturned.errors;
            });
            $httpBackend.flush();
            expect(error["item.Global"]).toContain("Error");
        });

    });

    describe('add : ', function(){

        it('ok', function () {
            var data;

            $httpBackend.expectPOST(/\/api\/User\/*/)
            .respond(function (method, url, data, headers) {
                // retrieving the name
                var jsonObj = JSON.parse(data);
                return [200,jsonObj];
            });

            userService.add(createUserList()[0]).then(function(dataReturned){
                data = dataReturned;
            });
            $httpBackend.flush();
            expect(data).toEqual(createUserList()[0]);
        });

        it('respond an error', function () {
            var error;
            $httpBackend.expectPOST(/\/api\/User\/*/).respond(500,{Message: "Error"});
            userService.add(createUserList()[0]).catch(function(errorReturned){
                error = errorReturned.errors;
            });
            $httpBackend.flush();
            expect(error["item.Global"]).toContain("Error");
        });

    });

    describe('update : ', function(){

        it('ok', function () {
            var data;

            $httpBackend.expectPUT(/\/api\/User\/*/)
            .respond(function (method, url, data, headers) {
                // retrieving the name
                var jsonObj = JSON.parse(data);
                return [200,jsonObj];
            });

            userService.update("1",createUserList()[0]).then(function(dataReturned){
                data = dataReturned;
            });
            $httpBackend.flush();
            expect(data).toEqual(createUserList()[0]);
        });

        it('respond an error', function () {
            var error;
            $httpBackend.expectPUT(/\/api\/User\/*/).respond(500,{Message: "Error"});
            userService.update(createUserList()[0]).catch(function(errorReturned){
                error = errorReturned.errors;
            });
            $httpBackend.flush();
            expect(error["item.Global"]).toContain("Error");
        });

    });

    describe('deletUser : ', function(){

        it('ok', function () {
            var id = "1";
            var data;
            $httpBackend.expectDELETE(/\/api\/User\/1*/)
            .respond(200,true);

            userService.delete(id).then(function(dataReturned){
                data = dataReturned;
            });
            $httpBackend.flush();
            expect(data).toEqual(true);
        });

        it('respond an error', function () {
            var id = "1";
            var error;
            $httpBackend.expectDELETE(/\/api\/User\/1*/).respond(500,{Message: "Error"});
            userService.delete(createUserList()[0]).catch(function(errorReturned){
                error = errorReturned.errors;
            });
            $httpBackend.flush();
            expect(error["item.Global"]).toContain("Error");
        });

    });

});

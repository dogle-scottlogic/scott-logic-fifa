describe('The EditTeamController', function() {
    beforeEach(module('team'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var editTeamController;
    var teamService;
    var locationService;
    var defer;
    var initDefer;
    var rootScope;

    //Mock the team service
    beforeEach(function() {
        module(function($provide) {
            // Fake teamService Implementation
            $provide.value('teamService', teamService);
            $provide.value('$location', locationService);
        });

        teamService = jasmine.createSpyObj('teamService', [ 'getTeam', 'updateTeam' ]);
        locationService = jasmine.createSpyObj('locationService', [ 'path' ]);

        // Getting the dependencies
        inject(function($injector) {
            $q = $injector.get('$q');
            initDefer = $q.defer();
            rootScope = $injector.get('$rootScope');
        });
    });

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();

        //Constructor calls a promise straight away, so we will resolve this to avoid interference with the method testing
        initDefer.resolve(null);
        teamService.getTeam.and.returnValue(initDefer.promise);
        editTeamController = $controller(FifaLeagueClient.Module.Team.EditTeamController, {$scope: scope, $routeParams: {}});

        scope.$digest();

        //Set new defer for methods
        defer = $q.defer();
    }));

    describe('when updating a team', function() {
        it('creates a loading promise', function() {
            teamService.updateTeam.and.returnValue(defer.promise);
            // We simulate we have loaded a team
            editTeamController.team = createTeamModel();

            // And that we submitted this team for an update
            editTeamController.updateTeam();

            verifyPromiseAndDigest(editTeamController, defer, rootScope);
        });

        it('passes the team from the controller to the service correctly', function() {
            teamService.updateTeam.and.returnValue(defer.promise);
            // We simulate we have loaded a team
            editTeamController.team =  createTeamModel();

            // And that we submitted this team
            editTeamController.updateTeam();
            verifyPromiseAndDigest(editTeamController, defer, rootScope);

            var expectedTeam = createTeamModel();
            expect(teamService.updateTeam).toHaveBeenCalledWith(expectedTeam);
        });

        it('redirects to the teams page if it succeeds', function() {
            teamService.updateTeam.and.returnValue(defer.promise);
            // We simulate we have loaded a team
            editTeamController.team =  createTeamModel();

            // And that we submitted this team
            editTeamController.updateTeam();
            defer.resolve();
            verifyPromiseAndDigest(editTeamController, defer, rootScope);

            expect(locationService.path).toHaveBeenCalledWith('/teams');
        });

        it('adds the errors to the team controller and does not redirect when it fails', function() {
            defer.reject({errors: createErrors()});
            teamService.updateTeam.and.returnValue(defer.promise);
            // We simulate we have loaded a team
            editTeamController.team =  createTeamModel();

            // And that we submitted this team
            editTeamController.updateTeam();
            
            // And that it failed
            verifyPromiseAndDigest(editTeamController, defer, rootScope);

            expect(editTeamController.errors).toEqual(createErrors());
            expect(locationService.path).not.toHaveBeenCalled();
        });
    });
    
    describe('when retreiving a team', function() {
        it('creates a loading promise', function() {
            //Load new team
            editTeamController.loadTeam();

            verifyPromiseAndDigest(editTeamController, defer, rootScope);
        });

        it('calls the team service with the id set on the controller', function() {
            // We simulate we have set a team on this controller
            editTeamController.id = 1;

            //Load that team
            editTeamController.loadTeam();

            expect(teamService.getTeam).toHaveBeenCalledWith(1);
        });

        it('sets the loaded team to be the retreived one on success', function() {
            teamService.getTeam.and.returnValue(defer.promise);
            defer.resolve(createTeamModel());
            // We simulate we have set a team on this controller
            editTeamController.id = 1;

            // And that we loaded the team
            editTeamController.loadTeam();
            verifyPromiseAndDigest(editTeamController, defer, rootScope);
            
            expect(editTeamController.team).toEqual(createTeamModel());
        });

        it('sets an error on the controller if it fails', function() {
            teamService.getTeam.and.returnValue(defer.promise);
            // We simulate we have set a team on this controller
            editTeamController.id = 1;

            // And that we failed to load that team
            editTeamController.loadTeam();
            defer.reject({errors: createErrors()});
            verifyPromiseAndDigest(editTeamController, defer, rootScope);
            
            expect(editTeamController.errors).toEqual(createErrors());
        });
    });
});
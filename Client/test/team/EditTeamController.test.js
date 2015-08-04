describe('The EditTeamController', function() {
    beforeEach(module('team'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var editTeamController;
    var teamService;
    var locationService;
    var defer;
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
            defer = $q.defer();
            rootScope = $injector.get('$rootScope');
        });
    });

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();

        teamService.getTeam.and.returnValue(defer.promise);
        editTeamController = $controller(FifaLeagueClient.Module.Team.EditTeamController, {$scope: scope, $routeParams: {}});

        scope.$digest();
    }));

    describe('when updating a team', function() {
        it('creates a loading promise', function() {
             // The constructor creates a promsie request, we must resolve this now so that this method does not pass falsly
            verifyPromiseAndDigest(editTeamController, defer, rootScope);

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

            var expectedTeam = createTeamModel();
            expect(teamService.updateTeam).toHaveBeenCalledWith(expectedTeam);
        });

        it('redirects to the teams page if it succeeds', function() {
            teamService.updateTeam.and.returnValue(defer.promise);
            // We simulate we have loaded a team
            editTeamController.team =  createTeamModel();

            // And that we submitted this team
            editTeamController.updateTeam();
            verifyPromiseAndDigest(editTeamController, defer, rootScope);

            expect(locationService.path).toHaveBeenCalledWith('/teams');
        });

        it('adds the errors to the team controller and does not redirect when it fails', function() {
            teamService.updateTeam.and.returnValue(defer.promise);
            // We simulate we have loaded a team
            editTeamController.team =  createTeamModel();

            // And that we submitted this team
            editTeamController.updateTeam();
            
            // And that it failed
            defer.reject({errors: createErrors()});
            verifyPromiseAndDigest(editTeamController, defer, rootScope);

            expect(editTeamController.errors).toEqual(createErrors());
            expect(locationService.path).not.toHaveBeenCalled();
        });
    });
    
    describe('when retreiving a team', function() {
        it('creates a loading promise', function() {
            // The constructor creates a promsie request, we must resolve this now so that this method does not pass falsly
            verifyPromiseAndDigest(editTeamController, defer, rootScope);

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
            // We simulate we have set a team on this controller
            editTeamController.id = 1;

            // And that we loaded that team successfully
            editTeamController.loadTeam();
            defer.resolve(createTeamModel());
            verifyPromiseAndDigest(editTeamController, defer, rootScope);
            
            expect(editTeamController.team).toEqual(createTeamModel());
        });

        it('sets an error on the controller if it fails', function() {
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
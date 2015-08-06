describe('Testing the AddTeamController', function() {
    beforeEach(module('team'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var addTeamController;
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

        teamService = jasmine.createSpyObj('teamService', [ 'addTeam' ]);
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

        addTeamController = $controller(FifaLeagueClient.Module.Team.AddTeamController, {$scope: scope});

        scope.$digest();
    }));

    it('when adding team it creates a loading promise', function() {
        teamService.addTeam.and.returnValue(defer.promise);
        // We simulate we entered a new Team
        addTeamController.team = createTeamModel();

        // And that we submitted this team
        addTeamController.addTeam();

        verifyPromiseAndDigest(addTeamController, defer, rootScope);
    });

    it('when adding team it passes the team from the controller to the service addTeam method', function() {
        teamService.addTeam.and.returnValue(defer.promise);
        // We simulate we entered a new Team on the controller
        addTeamController.team =  createTeamModel();

        // And that we submitted this team
        addTeamController.addTeam();

        var expectedTeam = createTeamModel();
        expect(teamService.addTeam).toHaveBeenCalledWith(expectedTeam);
    });

    it('after having added a team successfully it redirects to the teams page', function() {
        teamService.addTeam.and.returnValue(defer.promise);
        // We simulate we entered a new Team on the controller
        addTeamController.team =  createTeamModel();

        // And that we submitted this team
        addTeamController.addTeam();
        verifyPromiseAndDigest(addTeamController, defer, rootScope);

        expect(locationService.path).toHaveBeenCalledWith('/teams');
    });

    it('after having failed to add a team it adds the errors to the team controller and does not redirect', function() {
        teamService.addTeam.and.returnValue(defer.promise);
        // We simulate we entered a new Team on the controller
        addTeamController.team =  createTeamModel();

        // And that we submitted this team
        addTeamController.addTeam();
        
        // And that it failed
        defer.reject({errors: createErrors()});
        verifyPromiseAndDigest(addTeamController, defer, rootScope);

        expect(addTeamController.errors).toEqual(createErrors());
        expect(locationService.path).not.toHaveBeenCalled();
    });

});
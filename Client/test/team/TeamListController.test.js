describe('The TeamListController', function() {
    beforeEach(module('team'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var teamListController;
    var teamService;
    var locationService;
    var defer;
    var rootScope;

    //Mock the team service
    beforeEach(function() {
        module(function($provide) {
            // Fake teamService Implementation
            $provide.value('teamService', teamService);
        });

        teamService = jasmine.createSpyObj('teamService', [ 'getTeamFilteredList', 'deleteTeam' ]);

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

        teamListController = $controller(FifaLeagueClient.Module.Team.TeamController, {$scope: scope});

        scope.$digest();
    }));

    describe('when getting the team list', function() {

        it('creates a loading promise', function() {
            teamService.getTeamFilteredList.and.returnValue(defer.promise);

            // Simulate team list retrieval
            teamListController.getTeamList();

            verifyPromiseAndDigest(teamListController, defer, rootScope);
        });

        it('it passes the filter from the controller to the service', function() {
            teamService.getTeamFilteredList.and.returnValue(defer.promise);
            // We simulate we entered a filter on the controller
            teamListController.filter =  createFilter();

            // And that we retrieved the list of teams
            teamListController.getTeamList();

            expect(teamService.getTeamFilteredList).toHaveBeenCalledWith(createFilter());
        });

        it('succeeds it sets the teams on the controller', function() {
            teamService.getTeamFilteredList.and.returnValue(defer.promise);
            // We simulate we entered a filter on the controller
            teamListController.filter =  createFilter();

            // And that we retrieved the list of teams successfully
            teamListController.getTeamList();
            defer.resolve(createTeamList());
            verifyPromiseAndDigest(teamListController, defer, rootScope);

            expect(teamListController.teams).toEqual(createTeamList());
        });

        it('fails it adds the errors to the controller', function() {
            teamService.getTeamFilteredList.and.returnValue(defer.promise);
            // We simulate we entered a filter on the controller
            teamListController.filter =  createFilter();

            // And that we submitted this team
            teamListController.getTeamList();
            
            // And that it failed
            defer.reject({errors: createErrors()});
            verifyPromiseAndDigest(teamListController, defer, rootScope);

            expect(teamListController.errors).toEqual(createErrors());
        });
    });

    describe('when deleting a team', function() {

        it('it creates a loading promise', function() {
            teamService.deleteTeam.and.returnValue(defer.promise);
            teamService.getTeamFilteredList.and.returnValue(defer.promise);

            // Simulate deleting a team
            teamListController.deleteTeam(3);

            verifyPromiseAndDigest(teamListController, defer, rootScope);
        });

        it('it passes the teams id to the service', function() {
            teamService.deleteTeam.and.returnValue(defer.promise);

            // When successfully deleting a team
            teamListController.deleteTeam(3);

            expect(teamService.deleteTeam).toHaveBeenCalledWith(3);
        });

        it('succeeds it calls showTeams on the controller', function() {
            teamService.deleteTeam.and.returnValue(defer.promise);
            spyOn(teamListController, "showTeams");

            // When successfully deleting a team
            teamListController.deleteTeam(3);
            defer.resolve();
            verifyPromiseAndDigest(teamListController, defer, rootScope);

            expect(teamListController.showTeams).toHaveBeenCalled();
        });

        it('fails it adds the errors to the controller', function() {
            teamService.deleteTeam.and.returnValue(defer.promise);

            // When failnig to delete a team
            teamListController.deleteTeam(3);
            defer.reject({errors: createErrors()});
            verifyPromiseAndDigest(teamListController, defer, rootScope);

            expect(teamListController.errors).toEqual(createErrors());
        });
    });
});
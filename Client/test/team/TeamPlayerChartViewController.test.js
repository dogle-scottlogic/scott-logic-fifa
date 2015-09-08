describe('Testing the TeamPlayerChartViewController', function() {
    beforeEach(module('team'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var teamPlayerChartViewController;
    var resultViewService;
    var locationService;
    var defer;
    var rootScope;

    //Mock the team service
    beforeEach(function() {
        module(function($provide) {
            $provide.value('resultViewService', resultViewService);
        });

        resultViewService = jasmine.createSpyObj('resultViewService', [ 'getResultViewFilteredList' ]);

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

        teamPlayerChartViewController = $controller(FifaLeagueClient.Module.Team.TeamPlayerChartViewController, {$scope: scope});

        scope.$digest();
    }));

    it('when loadTeamPlayerChart it creates a loading promise', function() {
        resultViewService.getResultViewFilteredList.and.returnValue(defer.promise);

        // we load the team player
        teamPlayerChartViewController.loadTeamPlayerChart();

        verifyPromiseAndDigest(teamPlayerChartViewController, defer, rootScope);
    });

    it('when loadTeamPlayerChart team it passes the team from the filter to the service method', function() {
        resultViewService.getResultViewFilteredList.and.returnValue(defer.promise);
        // We simulate the filter for the controller
        teamPlayerChartViewController.team =  createTeamModel();

        teamPlayerChartViewController.scope.seasonid = 1;
        teamPlayerChartViewController.scope.teamplayerid = 1;

        var filter = new FifaLeagueClient.Module.Results.ResultViewFilter();
        filter.PlayedMatch = true;
        filter.SeasonId = teamPlayerChartViewController.scope.seasonid;
        filter.TeamPlayerId = teamPlayerChartViewController.scope.teamplayerid;

        // we load the team player
        teamPlayerChartViewController.loadTeamPlayerChart();

        var expectedTeam = createTeamModel();
        expect(resultViewService.getResultViewFilteredList).toHaveBeenCalledWith(filter);
    });

    it('after having failed to loadTeamPlayerChart a team it adds the errors to the team controller', function() {
        resultViewService.getResultViewFilteredList.and.returnValue(defer.promise);

        // And that we submitted this team
        teamPlayerChartViewController.loadTeamPlayerChart();

        // And that it failed
        defer.reject({errors: createErrors()});
        verifyPromiseAndDigest(teamPlayerChartViewController, defer, rootScope);

        expect(teamPlayerChartViewController.errors).toEqual(createErrors());
    });

});

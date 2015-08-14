describe('Testing the SeasonTableViewShowController', function() {
    beforeEach(module('seasonTableView'));
    beforeEach(module('rules'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

    var seasonTableViewShowController;
    var $httpBackend;
    var dataRepository;

    // Mocking the season service
    beforeEach(function() {
        dataRepository = seasonTableView_buildDataRepository();
        // Mocking the datas
        inject(function($injector) {
            config = $injector.get(FifaLeagueClient.Module.Common.configService);
            $httpBackend = $injector.get('$httpBackend');
            $q = $injector.get('$q');
            seasonTableView_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
        });
    });

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();

        seasonTableViewShowController = $controller(FifaLeagueClient.Module.SeasonTableView.SeasonTableViewShowController,
        {$scope: scope});

        scope.$digest();
    }));

    describe('seasonTableViewShowController in normal case (no error) : ', function(){
        // Get test
        it('should get get the datarepository', function () {
            // And that we clicked a button or something
            seasonTableViewShowController.loadList();
            verifyPromiseAndFlush(seasonTableViewShowController, $httpBackend);

            var seasonTableViewList = seasonTableViewShowController.seasonTableViewList;
            expect(seasonTableViewList).toEqual(dataRepository);
        });
    });

    describe('get class for a teams row', function() {
        it('is promoted if there is a promotion place when top of second league', function() {
            var playerIndex = 0;
            var league = createLeague(5);
            var leagueIndex = 1;
            var seasonTableView = createSeasonTableViewWith2Leagues(1);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("promotion");
        });

         it('is promoted if they are 3rd with 3 promotion places', function() {
            var playerIndex = 2;
            var league = createLeague(5);
            var leagueIndex = 1;
            var seasonTableView = createSeasonTableViewWith2Leagues(3);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("promotion");
        });

        it('is not promoted if they are 3rd with 2 promotion places', function() {
            var playerIndex = 2;
            var league = createLeague(7);
            var leagueIndex = 1;
            var seasonTableView = createSeasonTableViewWith2Leagues(2);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("no-promotion-relegation");
        });

        it('is not promoted if in the first league', function() {
            var playerIndex = 0;
            var league = createLeague(5);
            var leagueIndex = 0;
            var seasonTableView = createSeasonTableViewWith2Leagues(1);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("no-promotion-relegation");
        });

        it('is not promoted if there are no promotion places', function() {
            var playerIndex = 0;
            var league = createLeague(5);
            var leagueIndex = 1;
            var seasonTableView = createSeasonTableViewWith2Leagues(0);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("no-promotion-relegation");
        });

        it('is relegated if there is a promotion place when bottom of top league', function() {
            var playerIndex = 4;
            var league = createLeague(5);
            var leagueIndex = 0;
            var seasonTableView = createSeasonTableViewWith2Leagues(1);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("relegation");
        });

        it('is relegated if they are 3rd bottom with 3 promotion places', function() {
            var playerIndex = 4;
            var league = createLeague(7);
            var leagueIndex = 0;
            var seasonTableView = createSeasonTableViewWith2Leagues(3);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("relegation");
        });

        it('is not relegated if they are 3rd bottom with 2 promotion places', function() {
            var playerIndex = 4;
            var league = createLeague(7);
            var leagueIndex = 0;
            var seasonTableView = createSeasonTableViewWith2Leagues(2);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("no-promotion-relegation");
        });

        it('is not relegated if in the bottom league', function() {
            var playerIndex = 4;
            var league = createLeague(5);
            var leagueIndex = 1;
            var seasonTableView = createSeasonTableViewWith2Leagues(1);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("no-promotion-relegation");
        });

        it('is not relegated if there are no promotion places', function() {
            var playerIndex = 4;
            var league = createLeague(5);
            var leagueIndex = 0;
            var seasonTableView = createSeasonTableViewWith2Leagues(0);

            var cls = seasonTableViewShowController.getClsForTeamRow(playerIndex, league, leagueIndex, seasonTableView);
            
            expect(cls).toBe("no-promotion-relegation");
        });
    });

    function createLeague (numTeams) {
        var league = new FifaLeagueClient.Module.SeasonTableView.LeagueTableViewModel(null);
        league.TeamPlayers = [];
        for (var i = 0; i < numTeams; i++) {
            league.TeamPlayers.push(new FifaLeagueClient.Module.SeasonTableView.TeamPlayerTableLeagueViewModel(null));
        }
        return league;
    }

    function createSeasonTableViewWith2Leagues(numPromotionPlaces) {
        var seasonTableView = new  FifaLeagueClient.Module.SeasonTableView.SeasonTableViewModel(null);
        seasonTableView.LeagueTables = [];
        for (var i = 0; i < 2; i++) {
            seasonTableView.LeagueTables.push(new FifaLeagueClient.Module.SeasonTableView.LeagueTableViewModel(null));
        }
        seasonTableView.RuleSet = new FifaLeagueClient.Module.Rules.RulesSetModel(null);
        seasonTableView.RuleSet.NumPromotionPlaces = numPromotionPlaces;
        return seasonTableView;
    }
});

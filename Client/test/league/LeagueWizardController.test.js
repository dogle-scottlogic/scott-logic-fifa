describe('LeagueWizardController', function() {
  beforeEach(module('league'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var generateLeagueController;
    var leagueService;
    var defer;
    var rootScope;

    //Mock the league service
  beforeEach(function() {
        module(function($provide) {
            $provide.value('generateLeagueService', leagueService);
        });

        leagueService = jasmine.createSpyObj('leagueService', [ 'getLeaguesFilteredList', 'generateLeague' ]);

        //Getting the dependencies
    inject(function($injector) {
            defer = $injector.get('$q').defer();
            rootScope = $injector.get('$rootScope');
    });
  });

    //Construct our league wizard controller
  beforeEach(inject(function($controller, $rootScope) {
        var scope = $rootScope.$new();

        generateLeagueController = $controller(FifaLeagueClient.Module.League.LeagueWizardController, {$scope: scope});

    scope.$digest();
    }))

    describe('when selecting players for league', function() {
        it('never calls the service if there is no country set', function() {
            // Select the players and ensure that if a promise had of been called, then it would return
            leagueService.getLeaguesFilteredList.and.returnValue(defer.promise);
            generateLeagueController.validatePlayerSelectionStep();
            defer.resolve();
            rootScope.$digest();

            expect(leagueService.getLeaguesFilteredList).not.toHaveBeenCalled();
        });

        it('asks the service to create the league with the number of players that are selected', function() {
            generateLeagueController.generateLeague.CountryId = 1;
            // Faking the selected players
            generateLeagueController.generateLeague.Rules = new FifaLeagueClient.Module.Rules.RulesSetModel({
              Id: 1,
              Name: "Standard",
              LegsPlayedPerOpponent: 2
            });
            generateLeagueController.playerSelection = generatePlayerSelection();
            //Select Roger and Ronald but not Robert
            generateLeagueController.playerSelection[0].selected = true;
            generateLeagueController.playerSelection[2].selected = true;
            // Select the players and ensure that the service returns a successful promise
            defer.resolve([]);
            leagueService.getLeaguesFilteredList.and.returnValue(defer.promise);
            generateLeagueController.validatePlayerSelectionStep();
            verifyPromiseAndDigest(generateLeagueController, defer, rootScope);

            expect(leagueService.getLeaguesFilteredList).toHaveBeenCalledWith(2, generateLeagueController.generateLeague);
        });

        it('and the service creates the leagues, it sets them to be the controllers leagues', function() {
            generateLeagueController.generateLeague.CountryId = 1;
            generateLeagueController.playerSelection = generatePlayerSelection();
            // Select the players and ensure that the service returns a successful promise
            defer.resolve(generateLeagues());
            leagueService.getLeaguesFilteredList.and.returnValue(defer.promise);
            generateLeagueController.validatePlayerSelectionStep();
            verifyPromiseAndDigest(generateLeagueController, defer, rootScope);

            expect(generateLeagueController.leagues).toEqual(generateLeagues());
    });

        it('and the service creates only one league, each player is assigned to that league', function() {
            generateLeagueController.generateLeague.CountryId = 1;
            generateLeagueController.playerSelection = generatePlayerSelection();
            //Select some players
            generateLeagueController.playerSelection[0].selected = true;
            generateLeagueController.playerSelection[2].selected = true;
            // Select the players and ensure that the service returns a successful promise
            defer.resolve(generateSingleLeague());
            leagueService.getLeaguesFilteredList.and.returnValue(defer.promise);
            generateLeagueController.validatePlayerSelectionStep();
            verifyPromiseAndDigest(generateLeagueController, defer, rootScope);

            var players = generateLeagueController.playerAssignLeague;
            expect(players[0].leagueId).toEqual(0);
            expect(players[1].leagueId).toEqual(0);
        });
    });

    describe('assigning players to leagues', function() {
        it('sends the players in the correct leagues to the service', function() {
            generateLeagueController.generateLeague.CountryId = 1;
            //Initialise two leagues
            var leagues = generateLeagues();
            generateLeagueController.leagues = leagues;
            //Create 4 players
            var player1 = new FifaLeagueClient.Module.Player.PlayerModel({Id:1,Name:"Reginald"});
            var player2 = new FifaLeagueClient.Module.Player.PlayerModel({Id:2,Name:"Rupert"});
            var player3 = new FifaLeagueClient.Module.Player.PlayerModel({Id:2,Name:"Rupert"});
            var player4 = new FifaLeagueClient.Module.Player.PlayerModel({Id:2,Name:"Rupert"});
            //Assign 2 players to each league
            var player1Assignee = assignPlayerToLeague(player1, 0);
            var player2Assignee = assignPlayerToLeague(player2, 0);
            var player3Assignee = assignPlayerToLeague(player3, 1);
            var player4Assignee = assignPlayerToLeague(player4, 1);
            generateLeagueController.playerAssignLeague = [ player1Assignee, player2Assignee, player3Assignee, player4Assignee ];

            //Expect the league service to get called with two leagues of two
            leagueService.generateLeague.and.callFake(function(leagueGenerator) {
                expect(leagueGenerator.CountryId).toEqual(1);
                expect(leagueGenerator.PlayerLeagues.length).toEqual(2);
                expect(leagueGenerator.PlayerLeagues[0].players).toContain(player1);
                expect(leagueGenerator.PlayerLeagues[0].players).toContain(player2);
                expect(leagueGenerator.PlayerLeagues[1].players).toContain(player3);
                expect(leagueGenerator.PlayerLeagues[1].players).toContain(player4);
                return defer.promise;
            });

            //Fire off assigning
            generateLeagueController.validateAssignPlayerToLeagueStep();
        });

        it('throws an error if you only assign one player to a league', function() {
            generateLeagueController.generateLeague.CountryId = 1;
            //Initialise a league
            var leagues = generateSingleLeague();
            generateLeagueController.leagues = leagues;
            //Create a player
            var player1 = new FifaLeagueClient.Module.Player.PlayerModel({Id:1,Name:"Reginald"});
            //Assign player to league
            var player1Assignee = assignPlayerToLeague(player1, 0);
            generateLeagueController.playerAssignLeague = [ player1Assignee ];

            generateLeagueController.validateAssignPlayerToLeagueStep();

            expect(generateLeagueController.seasonErrors).toEqual({ '0': "A league cannot have only one team" });
        });
    });

    function assignPlayerToLeague(player, leagueId) {
        var assignment = new FifaLeagueClient.Module.League.Directives.PlayerAssignLeague(player);
        assignment.leagueId = leagueId;
        return assignment;
    }

    function generatePlayerSelection() {
        var player1 = new FifaLeagueClient.Module.Player.PlayerModel({Id:1,Name:"Roger"});
        var player2 = new FifaLeagueClient.Module.Player.PlayerModel({Id:2,Name:"Robert"});
        var player3 = new FifaLeagueClient.Module.Player.PlayerModel({Id:3,Name:"Ronald"});
        var list = [];
        list.push(new FifaLeagueClient.Module.Player.Directives.SelectablePlayerModel(player1));
        list.push(new FifaLeagueClient.Module.Player.Directives.SelectablePlayerModel(player2));
        list.push(new FifaLeagueClient.Module.Player.Directives.SelectablePlayerModel(player3));
        return list;
    }

    function generateLeagues() {
        var leagues = [];
        leagues.push(new FifaLeagueClient.Module.League.LeagueModel({ Id: 0, Name: "League 1" }));
        leagues.push(new FifaLeagueClient.Module.League.LeagueModel({ Id: 1, Name: "League 2" }));
        return leagues;
    }

    function generateSingleLeague() {
        return [new FifaLeagueClient.Module.League.LeagueModel({ Id: 0, Name: "League 1" })];
    }
});
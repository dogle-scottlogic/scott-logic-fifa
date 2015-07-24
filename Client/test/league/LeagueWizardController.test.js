describe('Testing the LeagueWizardController', function() {
  beforeEach(module('league'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

  var leagueWizardController;
  var $httpBackend;

  var dataRepository;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = generateLeague_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      generateLeague_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    leagueWizardController = $controller(FifaLeagueClient.Module.League.LeagueWizardController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('LeagueWizardController in normal case (no error) : ', function(){

    it('Should fill the league list', function () {

       // Facking the selected players
       leagueWizardController.countryId = 1;
       leagueWizardController.generateLeague.SeasonId = 5;
       var player1 = new FifaLeagueClient.Module.Player.PlayerModel({Id:1,Name:"Roger"});
       var player2 = new FifaLeagueClient.Module.Player.PlayerModel({Id:2,Name:"Robert"});
       leagueWizardController.playerSelection = [new FifaLeagueClient.Module.Player.Directives.SelectablePlayerModel(player1),
                                                new FifaLeagueClient.Module.Player.Directives.SelectablePlayerModel(player2)];

        // we select only roger
       leagueWizardController.playerSelection[0].selected = true;

        // Validate the player selection which mean have the selected player in repo
        leagueWizardController.validatePlayerSelectionStep();
        verifyPromiseAndFlush(leagueWizardController, $httpBackend);
        // Expect to have 2 leagues in the controller
        expect(leagueWizardController.leagues.length).toEqual(2);

    });

    it('Should create new league for a season', function () {

      // filling the league
      var league1 = new FifaLeagueClient.Module.League.LeagueModel({Id:1,Name:"League 1"});
      var league2 = new FifaLeagueClient.Module.League.LeagueModel({Id:2,Name:"League 2"});
      leagueWizardController.leagues = [league1,league2];
       // Facking the selected players
       leagueWizardController.countryId = 1;
       leagueWizardController.generateLeague.SeasonId = 5;
       var player1 = new FifaLeagueClient.Module.Player.PlayerModel({Id:1,Name:"Roger"});
       var player2 = new FifaLeagueClient.Module.Player.PlayerModel({Id:2,Name:"Robert"});
       leagueWizardController.playerAssignLeague = [new FifaLeagueClient.Module.League.Directives.PlayerAssignLeague(player1),
                                                new FifaLeagueClient.Module.League.Directives.PlayerAssignLeague(player2)];
        leagueWizardController.playerAssignLeague[0].leagueId = 1;
        leagueWizardController.playerAssignLeague[1].leagueId = 2;


        // Validate the player selection which mean have the selected player in repo
        leagueWizardController.validateAssignPlayerToLeagueStep();
        verifyPromiseAndFlush(leagueWizardController, $httpBackend);
        // Expect to have Roger created in this new league and note Robert
        expect(dataRepository[dataRepository.length - 2].TeamPlayers[0].player.Name).toContain(player1.Name);
        expect(dataRepository[dataRepository.length - 1].TeamPlayers[0].player.Name).toContain(player2.Name);

    });



  });


});

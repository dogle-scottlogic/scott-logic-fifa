describe('Testing the LeagueWizardController', function() {
  beforeEach(module('league'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

  var leagueWizardController;
  var $httpBackend;

  var dataRepository;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = league_buildDataRepository();

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

    it('Should create new league for a season', function () {

       // Facking the selected players
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
        // Expect to have Roger created in this new league and note Robert
        expect(dataRepository[dataRepository.length - 1].TeamPlayers[0].player.Name).toContain(player1.Name);
        expect(dataRepository[dataRepository.length - 1].TeamPlayers[0].player.Name).not.toContain(player2.Name);

    });



  });


});

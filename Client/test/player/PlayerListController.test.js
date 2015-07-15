describe('Testing the PlayerListController', function() {
  beforeEach(module('player'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

  var playerListController;
  var $httpBackend;

  var dataRepository;

  // Mocking the player service
  beforeEach(function() {

    dataRepository = player_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      player_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    playerListController = $controller(FifaLeagueClient.Module.Player.PlayerListController,
        {$scope: scope});


    // Initialize the list of the players
    playerListController.showPlayers();
    verifyPromiseAndFlush(playerListController, $httpBackend);

    scope.$digest();
  }));

  describe('PlayerListController in normal case (no error) : ', function(){

    it('should contain all the players at initialize', function() {
      expect(playerListController.players).toEqual(dataRepository);
    });

  });


    it('should delete player', function () {

      var nbRow = playerListController.players.length;

      // And that we clicked a button or something
      playerListController.deletePlayer(2);
      verifyPromiseAndFlush(playerListController, $httpBackend);

      var nbRowAfterDelete = playerListController.players.length;
      expect(nbRow).toEqual(nbRowAfterDelete + 1);
    });


});

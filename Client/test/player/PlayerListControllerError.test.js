describe('Testing the PlayerListController in error', function() {
  beforeEach(module('player'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

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

      player_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
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

  describe('PlayerListController in error case : ', function(){

    it('should contain an error', function() {
      expect(playerListController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
    });

    it('Try deleting a player which not exists', function () {

      var nbRow = playerListController.players.length;

      // And that we clicked a button or something
      playerListController.deletePlayer(2);
      verifyPromiseAndFlush(playerListController, $httpBackend);

      expect(playerListController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

  });


});

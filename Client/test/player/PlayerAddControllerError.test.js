describe('Testing the PlayerAddController in error', function() {
  beforeEach(module('player'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var playerAddController;
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

    playerAddController = $controller(FifaLeagueClient.Module.Player.PlayerAddController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('PlayerAddController in error case : ', function(){

    it('Try creating a new player with an already existing name', function () {
      // We simulate we entered a new Player
      playerAddController.player.Name = "Robert";
      // And that we clicked a button or something
      playerAddController.addPlayer();
      verifyPromiseAndFlush(playerAddController, $httpBackend);

      expect(playerAddController.errors["item.Global"]).toEqual([ '400 : ', 'The player name already exists' ]);
    });

  });

});

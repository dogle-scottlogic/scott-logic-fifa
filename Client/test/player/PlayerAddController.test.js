describe('Testing the PlayerAddController', function() {
  beforeEach(module('player'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      player_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    playerAddController = $controller(FifaLeagueClient.Module.Player.PlayerAddController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('playerAddController in normal case (no error) : ', function(){

    it('Should create new player', function () {
      // We simulate we entered a new Player
      playerAddController.player.Name = "Robert";

      // And that we clicked a button or something
      playerAddController.addPlayer();
      verifyPromiseAndFlush(playerAddController, $httpBackend);

      var lastPlayer = dataRepository[dataRepository.length - 1];
      expect(lastPlayer.Name).toEqual(playerAddController.player.Name);
    });

  });


});

describe('Testing the PlayerEditController', function() {
  beforeEach(module('player'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

  var playerEditController;
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

    playerEditController = $controller(FifaLeagueClient.Module.Player.PlayerEditController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('playerEditController in normal case (no error) : ', function(){
  // Get test
    it('should get a player', function () {

      playerEditController.id = 2;
      // And that we clicked a button or something
      playerEditController.loadPlayer();
      verifyPromiseAndFlush(playerEditController, $httpBackend);

      var playerLoaded = playerEditController.player;
      expect(playerLoaded).toEqual(dataRepository[1]);
    });

    it('should update player and append it to the database', function () {

      playerEditController.player = new FifaLeagueClient.Module.Player.PlayerModel();
      // We simulate we change a player
      playerEditController.player.Id = 1;
      playerEditController.player.Name = "Robert";

      // And that we clicked a button or something
      playerEditController.updatePlayer();
      verifyPromiseAndFlush(playerEditController, $httpBackend);

      var updatedPlayer = dataRepository[0];
      expect(updatedPlayer.Name).toEqual(playerEditController.player.Name);
    });


  });


});

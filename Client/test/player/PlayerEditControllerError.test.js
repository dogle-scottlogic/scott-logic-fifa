describe('Testing the PlayerEditController in error', function() {
  beforeEach(module('player'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

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

      player_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    playerEditController = $controller(FifaLeagueClient.Module.Player.PlayerEditController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('PlayerEditController in error case : ', function(){

  // Get test
    it('Try getting a player but have an error', function () {
      playerEditController.id = 2;
      // And that we clicked a button or something
      playerEditController.loadPlayer();
      verifyPromiseAndFlush(playerEditController, $httpBackend);
      expect(playerEditController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

    it('Try update a player with an already existing name', function () {

      playerEditController.player = new FifaLeagueClient.Module.Player.PlayerModel();
      // We simulate we change a player
      playerEditController.player.Id = 1;
      playerEditController.player.Name = "Robert";
      // And that we clicked a button or something
      playerEditController.updatePlayer();
      verifyPromiseAndFlush(playerEditController, $httpBackend);

      expect(playerEditController.errors["item.Global"]).toEqual([ '400 : ', 'The player name already exists' ]);
    });

  });


});

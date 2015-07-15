describe('Testing the PlayerSelectListController in error', function() {
  beforeEach(module('player'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var playerSelectListController;
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

    playerSelectListController = $controller(FifaLeagueClient.Module.Player.PlayerSelectListController,
        {$scope: scope});

    // Initialize the list of the players
    playerSelectListController.fillPlayers();
    verifyPromiseAndFlush(playerSelectListController, $httpBackend);

    scope.$digest();
  }));

  describe('PlayerSelectListController in error case : ', function(){

    it('should contain an error', function() {
      expect(playerSelectListController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
    });


  });


});

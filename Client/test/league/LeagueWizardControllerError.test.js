describe('Testing the LeagueWizardController in error', function() {
  beforeEach(module('league'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var generateLeagueController;
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

      generateLeague_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    generateLeagueController = $controller(FifaLeagueClient.Module.League.LeagueWizardController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('LeagueWizardController in error case : ', function(){

  // Get test
    it('Try create a league but have an error', function () {

      // And that we clicked a button or something
      generateLeagueController.validatePlayerSelectionStep();
      verifyPromiseAndFlush(generateLeagueController, $httpBackend);
      expect(generateLeagueController.errors["item.Global"]).toEqual([ '500 : ', 'A league already exists' ]);
    });

  });


});

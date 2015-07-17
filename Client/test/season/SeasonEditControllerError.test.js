describe('Testing the SeasonEditController in error', function() {
  beforeEach(module('season'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var seasonEditController;
  var $httpBackend;

  var dataRepository;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = season_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      season_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    seasonEditController = $controller(FifaLeagueClient.Module.Season.SeasonEditController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('SeasonEditController in error case : ', function(){

  // Get test
    it('Try getting a season but have an error', function () {
      seasonEditController.id = 2;
      // And that we clicked a button or something
      seasonEditController.loadSeason();
      verifyPromiseAndFlush(seasonEditController, $httpBackend);
      expect(seasonEditController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

    it('Try update a season with an already existing name', function () {

      seasonEditController.season = new FifaLeagueClient.Module.Season.SeasonModel();
      // We simulate we change a season
      seasonEditController.season.Id = 1;
      seasonEditController.season.Name = "Season 1";
      // And that we clicked a button or something
      seasonEditController.updateSeason();
      verifyPromiseAndFlush(seasonEditController, $httpBackend);

      expect(seasonEditController.errors["item.Global"]).toEqual([ '400 : ', 'The season name already exists' ]);
    });

  });


});

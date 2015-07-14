describe('Testing the SeasonAddController in error', function() {
  beforeEach(module('season'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var seasonAddController;
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

    seasonAddController = $controller(FifaLeagueClient.Module.Season.SeasonAddController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('SeasonAddController in error case : ', function(){

    it('Try creating a new season with an already existing name', function () {
      // We simulate we entered a new Season
      seasonAddController.season.Name = "Spain";
      // And that we clicked a button or something
      seasonAddController.addSeason();
      verifyPromiseAndFlush(seasonAddController, $httpBackend);

      expect(seasonAddController.errors["item.Global"]).toEqual([ '400 : ', 'The season name already exists' ]);
    });

  });

});

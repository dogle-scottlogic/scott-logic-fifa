describe('Testing the SeasonListController in error', function() {
  beforeEach(module('season'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var seasonListController;
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

    seasonListController = $controller(FifaLeagueClient.Module.Season.SeasonListController,
        {$scope: scope});

    // Initialize the list of the seasons
    seasonListController.showSeasons();
    verifyPromiseAndFlush(seasonListController, $httpBackend);

    scope.$digest();
  }));

  describe('SeasonListController in error case : ', function(){

    it('should contain an error', function() {
      expect(seasonListController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
    });

    it('Try deleting a season which not exists', function () {

      var nbRow = seasonListController.seasons.length;

      // And that we clicked a button or something
      seasonListController.deleteSeason(2);
      verifyPromiseAndFlush(seasonListController, $httpBackend);

      expect(seasonListController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

  });


});

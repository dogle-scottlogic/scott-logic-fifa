describe('Testing the SeasonViewShowController in error', function() {
  beforeEach(module('season'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var seasonViewShowController;
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

    seasonViewShowController = $controller(FifaLeagueClient.Module.Season.SeasonViewShowController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('SeasonViewShowController in error case : ', function(){

  // Get test
    it('Try getting a season but have an error', function () {
      // And that we clicked a button or something
      seasonViewShowController.loadSeason(2);
      verifyPromiseAndFlush(seasonViewShowController, $httpBackend);
      expect(seasonViewShowController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

  });


});

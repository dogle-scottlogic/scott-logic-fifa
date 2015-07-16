describe('Testing the SeasonViewShowController', function() {
  beforeEach(module('season'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      season_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    seasonViewShowController = $controller(FifaLeagueClient.Module.Season.SeasonViewShowController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('seasonViewShowController in normal case (no error) : ', function(){
  // Get test
    it('should get a season', function () {

      // And that we clicked a button or something
      seasonViewShowController.loadSeason(2);
      verifyPromiseAndFlush(seasonViewShowController, $httpBackend);

      var seasonLoaded = seasonViewShowController.seasonView;
      expect(seasonLoaded.Name).toEqual(dataRepository[1].Name);
    });


  });


});

describe('Testing the SeasonAddController', function() {
  beforeEach(module('season'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      season_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    seasonAddController = $controller(FifaLeagueClient.Module.Season.SeasonAddController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('seasonAddController in normal case (no error) : ', function(){

    it('Should create new season', function () {
      // We simulate we entered a new Season
      seasonAddController.season.Name = "Season 1";

      // And that we clicked a button or something
      seasonAddController.addSeason();
      verifyPromiseAndFlush(seasonAddController, $httpBackend);

      var lastSeason = dataRepository[dataRepository.length - 1];
      expect(lastSeason.Name).toEqual(seasonAddController.season.Name);
    });

  });


});

describe('Testing the SeasonEditController', function() {
  beforeEach(module('season'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      season_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    seasonEditController = $controller(FifaLeagueClient.Module.Season.SeasonEditController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('seasonEditController in normal case (no error) : ', function(){
  // Get test
    it('should get a season', function () {

      seasonEditController.id = 2;
      // And that we clicked a button or something
      seasonEditController.loadSeason();
      verifyPromiseAndFlush(seasonEditController, $httpBackend);

      var seasonLoaded = seasonEditController.season;
      expect(seasonLoaded).toEqual(dataRepository[1]);
    });

    it('should update season and append it to the database', function () {

      seasonEditController.season = new FifaLeagueClient.Module.Season.SeasonModel();
      // We simulate we change a season
      seasonEditController.season.Id = 1;
      seasonEditController.season.Name = "Francia";

      // And that we clicked a button or something
      seasonEditController.updateSeason();
      verifyPromiseAndFlush(seasonEditController, $httpBackend);

      var updatedSeason = dataRepository[0];
      expect(updatedSeason.Name).toEqual(seasonEditController.season.Name);
    });


  });


});

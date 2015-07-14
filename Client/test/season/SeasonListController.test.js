describe('Testing the SeasonListController', function() {
  beforeEach(module('season'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      season_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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

  describe('SeasonListController in normal case (no error) : ', function(){

    it('should contain all the seasons at initialize', function() {
      expect(seasonListController.seasons).toEqual(dataRepository);
    });

  });


    it('should delete season', function () {

      var nbRow = seasonListController.seasons.length;

      // And that we clicked a button or something
      seasonListController.deleteSeason(2);
      verifyPromiseAndFlush(seasonListController, $httpBackend);

      var nbRowAfterDelete = seasonListController.seasons.length;
      expect(nbRow).toEqual(nbRowAfterDelete + 1);
    });


});

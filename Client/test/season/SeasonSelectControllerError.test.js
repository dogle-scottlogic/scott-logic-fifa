describe('Testing the SeasonSelectController in error', function() {
    beforeEach(module('season'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var seasonSelectController;
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

      seasonSelectController = $controller(FifaLeagueClient.Module.Season.SeasonSelectController,
          {$scope: scope});

      // Initialize the list of the seasons
      seasonSelectController.getSeasonList();
      verifyPromiseAndFlush(seasonSelectController, $httpBackend);

      scope.$digest();
    }));

    describe('SeasonSelectController in error case : ', function(){

      it('should contain an error', function() {
        expect(seasonSelectController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
      });

    });


});

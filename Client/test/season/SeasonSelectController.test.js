describe('Testing the SeasonSelectController', function() {
    beforeEach(module('season'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

    var seasonSelectController;
    var $httpBackend;

    var dataRepository;
    var mockedSeasonGetList;

    // Mocking the season service
    beforeEach(function() {

      dataRepository = season_buildDataRepository();

      // Mocking the datas
      inject(function($injector) {

        config = $injector.get(FifaLeagueClient.Module.Common.configService);
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');

        mockedSeasonGetList = season_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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

    describe('SeasonSelectController in normal case (no error) : ', function(){

      it('should contain all the seasons at initialize', function() {
        expect(seasonSelectController.seasons).toEqual(dataRepository);
      });

    });


    it('Shall select automatically the element if it is alone in the list', function () {

      // We the mocked get list in order to have only one element
      dataRepository = [dataRepository[0]];
      mockedSeasonGetList.respond(function (method, url, data, headers) {
          return [200,dataRepository];
      });

      seasonSelectController.getSeasonList();
      verifyPromiseAndFlush(seasonSelectController, $httpBackend);

      expect(seasonSelectController.scope.selectedseason).toEqual(dataRepository[0].Id);
    });


});

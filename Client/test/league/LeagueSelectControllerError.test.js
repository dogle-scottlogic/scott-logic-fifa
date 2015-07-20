describe('Testing the LeagueSelectController in error', function() {
    beforeEach(module('league'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var leagueSelectController;
    var $httpBackend;

    var dataRepository;

    // Mocking the league service
    beforeEach(function() {

      dataRepository = league_buildDataRepository();

      // Mocking the datas
      inject(function($injector) {

        config = $injector.get(FifaLeagueClient.Module.Common.configService);
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');

        league_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
      });

    });

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();

      leagueSelectController = $controller(FifaLeagueClient.Module.League.LeagueSelectController,
          {$scope: scope});

      // Initialize the list of the leagues
      leagueSelectController.getLeagueList();
      verifyPromiseAndFlush(leagueSelectController, $httpBackend);

      scope.$digest();
    }));

    describe('LeagueSelectController in error case : ', function(){

      it('should contain an error', function() {
        expect(leagueSelectController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
      });

    });


});

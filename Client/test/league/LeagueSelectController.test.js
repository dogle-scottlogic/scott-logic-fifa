describe('Testing the LeagueSelectController', function() {
    beforeEach(module('league'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

    var leagueSelectController;
    var $httpBackend;

    var dataRepository;
    var mockedLeagueGetList;

    // Mocking the league service
    beforeEach(function() {

      dataRepository = league_buildDataRepository();

      // Mocking the datas
      inject(function($injector) {

        config = $injector.get(FifaLeagueClient.Module.Common.configService);
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');

        mockedLeagueGetList = league_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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

    describe('LeagueSelectController in normal case (no error) : ', function(){

      it('should contain all the leagues at initialize', function() {
        expect(leagueSelectController.leagues).toEqual(dataRepository);
      });

    });


    it('Shall select automatically the element if it is alone in the list', function () {

      // We the mocked get list in order to have only one element
      dataRepository = [dataRepository[0]];
      mockedLeagueGetList.respond(function (method, url, data, headers) {
          return [200,dataRepository];
      });

      leagueSelectController.getLeagueList();
      verifyPromiseAndFlush(leagueSelectController, $httpBackend);

      expect(leagueSelectController.scope.selectedleague).toEqual(dataRepository[0].Id);
    });


});

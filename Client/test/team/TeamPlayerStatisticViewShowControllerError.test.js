describe('Testing the TeamPlayerStatisticViewShowController in error', function() {
  beforeEach(module('team'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var teamPlayerStatisticViewShowController;
  var $httpBackend;
  var $http;

  var dataRepository;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = teamPlayerStatisticView_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      $http = $injector.get('$http');

      teamPlayerStatisticView_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    teamPlayerStatisticViewShowController = $controller(FifaLeagueClient.Module.Team.TeamPlayerStatisticViewShowController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('teamPlayerStatisticViewShowController in error case : ', function(){

  // Get test
    it('should get an error result for the teamplayer / season called', function () {

      teamPlayerStatisticViewShowController.scope.teamplayerid = 1;
      teamPlayerStatisticViewShowController.scope.seasonid = 1;

      teamPlayerStatisticViewShowController.loadTeamPlayerStatistic();
      verifyPromiseAndFlush(teamPlayerStatisticViewShowController, $httpBackend);

      expect(teamPlayerStatisticViewShowController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
    });

  });


});

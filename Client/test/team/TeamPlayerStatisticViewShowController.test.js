describe('Testing the TeamPlayerStatisticViewShowController', function() {
  beforeEach(module('team'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      teamPlayerStatisticView_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    teamPlayerStatisticViewShowController = $controller(FifaLeagueClient.Module.Team.TeamPlayerStatisticViewShowController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('teamPlayerStatisticViewShowController in normal case (no error) : ', function(){

    it('should not call the service if teamplayerid and / or seasonid are empty ', function () {
      // We expect to have no request pending in this case
      teamPlayerStatisticViewShowController.loadTeamPlayerStatistic();

      expect($http.pendingRequests.length).toEqual(0);
    });
  // Get test
    it('should get a result for the teamplayer / season called', function () {

      teamPlayerStatisticViewShowController.scope.teamplayerid = 1;
      teamPlayerStatisticViewShowController.scope.seasonid = 1;

      teamPlayerStatisticViewShowController.loadTeamPlayerStatistic();
      verifyPromiseAndFlush(teamPlayerStatisticViewShowController, $httpBackend);

      var resultsLoaded = teamPlayerStatisticViewShowController.teamPlayerStatisticViewModel;
      expect(resultsLoaded).toEqual(getTeamPlayerStat(dataRepository, teamPlayerStatisticViewShowController.scope.teamplayerid, teamPlayerStatisticViewShowController.scope.seasonid));
    });

  });


});

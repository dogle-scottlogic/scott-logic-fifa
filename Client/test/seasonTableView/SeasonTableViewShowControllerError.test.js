describe('Testing the SeasonTableViewShowController in error', function() {
  beforeEach(module('seasonTableView'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var seasonTableViewShowController;
  var $httpBackend;

  var dataRepository;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = seasonTableView_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      seasonTableView_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    seasonTableViewShowController = $controller(FifaLeagueClient.Module.SeasonTableView.SeasonTableViewShowController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('SeasonTableViewShowController in error case : ', function(){

  // Get test
    it('Try getting a season but have an error', function () {
      // And that we clicked a button or something
      seasonTableViewShowController.loadSeasonTableViewList();
      verifyPromiseAndFlush(seasonTableViewShowController, $httpBackend);
      expect(seasonTableViewShowController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
    });

  });


});

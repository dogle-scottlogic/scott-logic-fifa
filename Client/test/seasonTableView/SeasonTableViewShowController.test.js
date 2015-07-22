describe('Testing the SeasonTableViewShowController', function() {
  beforeEach(module('seasonTableView'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      seasonTableView_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    seasonTableViewShowController = $controller(FifaLeagueClient.Module.SeasonTableView.SeasonTableViewShowController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('seasonTableViewShowController in normal case (no error) : ', function(){
  // Get test
    it('should get get the datarepository', function () {

      // And that we clicked a button or something
      seasonTableViewShowController.loadSeasonTableViewList();
      verifyPromiseAndFlush(seasonTableViewShowController, $httpBackend);

      var seasonTableViewList = seasonTableViewShowController.seasonTableViewList;
      expect(seasonTableViewList).toEqual(dataRepository);
    });


  });


});

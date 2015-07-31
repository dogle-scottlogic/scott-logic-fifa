describe('Testing the ResultViewShowController in error', function() {
  beforeEach(module('results'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var resultViewShowController;
  var $httpBackend;

  var dataRepository;

  // Mocking the result service
  beforeEach(function() {

    dataRepository = resultView_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      resultView_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    resultViewShowController = $controller(FifaLeagueClient.Module.Results.ResultViewShowController,
        {$scope: scope});

    // We put the date dateTo at null in order to not have error
    resultViewShowController.resultViewFilter.DateFrom = null;

    scope.$digest();
  }));

  describe('ResultViewShowController in error case : ', function(){

  // Get test
    it('Try getting the list of results but having an error', function () {
      // And that we clicked a button or something
      resultViewShowController.loadList();
      verifyPromiseAndFlush(resultViewShowController, $httpBackend);
      expect(resultViewShowController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
    });

  });


});

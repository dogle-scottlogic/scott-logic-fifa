describe('Testing the ResultViewShowController', function() {
  beforeEach(module('results'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

  var resultViewShowController;
  var $httpBackend;

  var dataRepository;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = resultView_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      resultView_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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


  describe('resultViewShowController in normal case (no error) : ', function(){
  // Get test
    it('should get a result for the list', function () {

      // And that we clicked a button or something
      resultViewShowController.loadList();
      verifyPromiseAndFlush(resultViewShowController, $httpBackend);

      var resultsLoaded = resultViewShowController.resultViewList;
      expect(resultsLoaded).toEqual(dataRepository);
    });

    // Get filtered test
      it('should get a filtered result for the list', function () {

        // And that we clicked a button or something
        resultViewShowController.resultViewFilter.CountryId = 1;
        resultViewShowController.loadList();
        verifyPromiseAndFlush(resultViewShowController, $httpBackend);

        var resultsLoaded = resultViewShowController.resultViewList;
        expect(resultsLoaded).toEqual(getresultByCountryId(dataRepository,resultViewShowController.resultViewFilter.CountryId));
      });


  });


});

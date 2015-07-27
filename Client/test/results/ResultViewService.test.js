describe('Testing the ResultViewService', function() {
  beforeEach(module('results'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var resultViewService;
  var $httpBackend;
  var dataRepository;


  // Mocking the results service
  beforeEach(function() {

    dataRepository = resultView_buildDataRepository();
    url = /\/api\/ResultView\/*/;
    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

    });

  });

  // Constructing the controller
  beforeEach(inject(function(_resultViewService_) {
    resultViewService = _resultViewService_;
  }));


  describe('ResultViewService in normal case (no error) : ', function(){
  // Get test
    it('getResultViewFilteredList - checking that the resultViewFilter parameter is added on call ', function () {

      var resultViewFilter = new FifaLeagueClient.Module.Results.ResultViewFilter(null);
      resultViewFilter.LeagueId = 1;
      var _resultViewFilter;
      var url = /\/api\/ResultView\?LeagueId=1*/;

      $httpBackend.expectGET(url,function (data, status, headers, config){
        _resultViewFilter = resultViewFilter
        return true;
      }).respond(200,true);

      var deferred = resultViewService.getResultViewFilteredList(resultViewFilter);
      $httpBackend.flush();
      expect(_resultViewFilter).toEqual(resultViewFilter);

    });

    it('getResultViewFilteredList - Success shall be returned with the list of datas', function () {

      var url = /\/api\/ResultView\/*/;

      $httpBackend.expectGET(url).respond(200,dataRepository);


      var deferred = resultViewService.getResultViewFilteredList(null);

      successCallback = jasmine.createSpy('success');
      errorCallback = jasmine.createSpy('error');
      deferred.then(successCallback)
      .catch(errorCallback);

      $httpBackend.flush();

      expect(successCallback).toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(deferred.$$state.value).toEqual(dataRepository);

    });

    it('getResultViewFilteredList - Error shall be returned as an error', function () {

      var matchResultDTO = new FifaLeagueClient.Module.Results.MatchResultDTO(null);
      var _matchResultDTO;
      var url = /\/api\/ResultView\/*/;

      $httpBackend.expectGET(url).respond(500,{Message: 'Error'});

      var deferred = resultViewService.getResultViewFilteredList(null);

      successCallback = jasmine.createSpy('success');
      errorCallback = jasmine.createSpy('error');
      deferred.then(successCallback)
      .catch(errorCallback);

      $httpBackend.flush();

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
      expect(deferred.$$state.value.errors["item.Global"]).toEqual([ '500 : ', 'Error' ]);

    });



  });


});

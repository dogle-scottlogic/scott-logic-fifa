describe('Testing the MatchResultService', function() {
  beforeEach(module('results'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var matchResultService;
  var $httpBackend;

  // Mocking the results service
  beforeEach(function() {

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

    });

  });

  // Constructing the controller
  beforeEach(inject(function(_matchResultsService_) {
    matchResultService = _matchResultsService_;
  }));


  describe('MatchResultService in normal case (no error) : ', function(){
  // Get test
    it('addResult - checking that the matchResultDTO parameter is added on call ', function () {

      var matchResultDTO = new FifaLeagueClient.Module.Results.MatchResultDTO(null);
      var _matchResultDTO;
      var url = /\/api\/MatchResult\/*/;

      $httpBackend.expectPOST(url,matchResultDTO,function (data, status, headers, config){
        _matchResultDTO = matchResultDTO
        return true;
      }).respond(200,true);

      var deferred = matchResultService.addResult(matchResultDTO);
      $httpBackend.flush();

    });

    it('addResult - Success shall be returned with true', function () {

      var matchResultDTO = new FifaLeagueClient.Module.Results.MatchResultDTO(null);
      var _matchResultDTO;
      var url = /\/api\/MatchResult\/*/;

      $httpBackend.expectPOST(url,undefined).respond([200,true]);


      var deferred = matchResultService.addResult(matchResultDTO);

      successCallback = jasmine.createSpy('success');
      errorCallback = jasmine.createSpy('error');
      deferred.then(successCallback)
      .catch(errorCallback);

      $httpBackend.flush();

      expect(successCallback).toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(deferred.$$state.value).toEqual([ 200, true]);

    });

    it('addResult - Error shall be returned as an error', function () {

      var matchResultDTO = new FifaLeagueClient.Module.Results.MatchResultDTO(null);
      var _matchResultDTO;
      var url = /\/api\/MatchResult\/*/;

      $httpBackend.expectPOST(url,undefined).respond(500,{Message: 'Error'});

      var deferred = matchResultService.addResult(matchResultDTO);

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

describe('Testing the MatchModalEditController', function() {
  beforeEach(module('FifaLeagueApp'));
  beforeEach(module('results'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var matchModalEditController;
  var $httpBackend, $rootScope;
  var modalInstance;
  var resultViewService;
  var	matchResultsService;

  var Id;


  // Mocking the match service
  beforeEach(function() {

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      defer = $q.defer();
      $rootScope = $injector.get('$rootScope');

      Id = 1;

      modalInstance = {                    // Create a mock object using spies
          close: jasmine.createSpy('modalInstance.close'),
          dismiss: jasmine.createSpy('modalInstance.dismiss'),
          result: {
            then: jasmine.createSpy('modalInstance.result.then')
          }
        };

      // Mocking the get service
      resultViewService = {
          getMatchResultView: function(Id){
              return defer.promise;
            }
      };

      // mocking the update service
      matchResultsService = {
          addResult: function(result){
              return defer.promise;
            }
      };


    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    matchModalEditController = $controller(FifaLeagueClient.Module.Results.MatchModalEditController,
        {$scope: scope, $modalInstance: modalInstance, Id: Id, resultViewService: resultViewService, matchResultsService: matchResultsService});

    scope.$digest();
  }));

  createAMatch = function(){
          // We simulate we change a match
        var match = {
            Id: 2,
            homeTeamPlayer : {
              Id: 1,
              nbGoals: 1
            },
            awayTeamPlayer : {
              Id: 2,
              nbGoals: 2
            },
            Date: new Date()
          };

      return match;
  }


  describe('matchModalEditController in normal case (no error) : ', function(){
  // Get test
    it('should get a match', function () {

      matchModalEditController.match.Id = 2;

      // returning a match
      var matchLoaded = createAMatch();
      defer.resolve(matchLoaded);
      spyOn(resultViewService, 'getMatchResultView').and.returnValue(defer.promise);


      // And that we clicked a button or something
      matchModalEditController.loadMatch();

      // Expect that the controller has called the service with the Id of the match
      expect(resultViewService.getMatchResultView).toHaveBeenCalledWith(matchModalEditController.match.Id);

      verifyPromiseAndDigest(matchModalEditController, defer, $rootScope);

      // expect in return to have the match returned by the service
      expect(matchModalEditController.match).toEqual(matchLoaded);

    });

    it('Expect an error on get', function () {

      matchModalEditController.match.Id = 2;

      // mocking the result with an error
      defer.reject([0,{status:0}]);
      spyOn(resultViewService, 'getMatchResultView').and.returnValue(defer.promise);
      spyOn(matchModalEditController, 'onError');

      // And that we clicked a button or something
      matchModalEditController.loadMatch();
      verifyPromiseAndDigest(matchModalEditController, defer, $rootScope);

      expect(matchModalEditController.onError).toHaveBeenCalled();


    });

    it('should update match and append it to the database', function () {

      matchModalEditController.match = createAMatch();

      spyOn(matchResultsService, 'addResult').and.returnValue(defer.promise);
      // And that we clicked a button or something
      matchModalEditController.saveResult();

      // Converting the match in MatchResultDTO which is the expected object
      var resultExpected = new FifaLeagueClient.Module.Results.MatchResultDTO();
      resultExpected.homePlayerId = matchModalEditController.match.homeTeamPlayer.Id;
      resultExpected.scoreHome = matchModalEditController.match.homeTeamPlayer.nbGoals;
      resultExpected.awayPlayerId = matchModalEditController.match.awayTeamPlayer.Id;
      resultExpected.scoreAway = matchModalEditController.match.awayTeamPlayer.nbGoals;
      resultExpected.date = matchModalEditController.match.Date;

      verifyPromiseAndDigest(matchModalEditController, defer, $rootScope);

      expect(matchResultsService.addResult).toHaveBeenCalledWith(resultExpected);

    });

    it('Expect an error on update', function () {

      matchModalEditController.match = createAMatch();

      // mocking the result with an error
      defer.reject([0,{status:0}]);
      spyOn(matchResultsService, 'addResult').and.returnValue(defer.promise);
      spyOn(matchModalEditController, 'onError');

      // And that we clicked a button or something
      matchModalEditController.saveResult();
      verifyPromiseAndDigest(matchModalEditController, defer, $rootScope);

      expect(matchModalEditController.onError).toHaveBeenCalled();


    });




  });


});

describe('Testing the LatestResultViewShowDirective', function() {
  var $compile,
      $rootScope,
      defer;

  var resultViewService;
  var instanceResultViewService;

  // Load the FifaLeagueApp
  beforeEach(module('FifaLeagueApp'));
  beforeEach(module('results'));

  // load the template
  beforeEach(module('templates'));

  var $httpBackend;
  var dataRepository;
  var $http;

  beforeEach(module(function($provide) {
      $provide.value('resultViewService', resultViewService);
    }));

  // Mocking the season service
  beforeEach(function() {

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      $http = $injector.get('$http');
      defer = $q.defer();

      // Mocking the get service
      resultViewService = {
        getResultViewFilteredList: function(resultViewFilter){
          return defer.promise;
        }
      };


    });

  });

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _resultViewService_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    instanceResultViewService = _resultViewService_;
  }));


  describe(' Tests show directive', function(){

    it('Show nothing', function() {

        var scope = $rootScope.$new();
        var html = angular.element('<latestresultviewshow></latestresultviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();

        expect($http.pendingRequests.length).toEqual(0);
      });

    it('Show all the results', function() {

        spyOn(instanceResultViewService, 'getResultViewFilteredList').and.returnValue(defer.promise);

        var scope = $rootScope.$new();
        var html = angular.element('<latestresultviewshow show="true"></latestresultviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();
        verifyPromiseAndDigest(element.isolateScope().vm, defer, $rootScope);
        // Check that the compiled element contains the templated content
        expect(instanceResultViewService.getResultViewFilteredList).toHaveBeenCalledWith(element.isolateScope().vm.resultViewFilter);
        expect(instanceResultViewService.getResultViewFilteredList.calls.count()).toEqual(1);
    });

    it('Show filtered', function() {

        spyOn(instanceResultViewService, 'getResultViewFilteredList').and.returnValue(defer.promise);

        var scope = $rootScope.$new();
        scope.filter = new FifaLeagueClient.Module.Results.ResultViewFilter();
        scope.filter.CountryId = 1;
        var html = angular.element('<latestresultviewshow filter="filter" show="true"></latestresultviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();
        verifyPromiseAndDigest(element.isolateScope().vm, defer, $rootScope);
        // Check that the compiled element contains the templated content
        expect(instanceResultViewService.getResultViewFilteredList).toHaveBeenCalledWith(scope.filter);
        expect(instanceResultViewService.getResultViewFilteredList.calls.count()).toEqual(1);
    });

    it('Change filter shall call again the service', function() {

        spyOn(instanceResultViewService, 'getResultViewFilteredList').and.returnValue(defer.promise);

        var scope = $rootScope.$new();
        scope.filter = new FifaLeagueClient.Module.Results.ResultViewFilter();
        scope.filter.CountryId = 1;
        var html = angular.element('<latestresultviewshow filter="filter" show="true"></latestresultviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();
        verifyPromiseAndDigest(element.isolateScope().vm, defer, $rootScope);
        // Check that the compiled element contains the templated content
        expect(instanceResultViewService.getResultViewFilteredList).toHaveBeenCalledWith(scope.filter);

        // We change the filter
        scope.filter.CountryId = 2;
        $rootScope.$digest();

        // Check that the compiled element contains the templated content
        expect(instanceResultViewService.getResultViewFilteredList.calls.count()).toEqual(2);
        expect(instanceResultViewService.getResultViewFilteredList).toHaveBeenCalledWith(scope.filter);
    });

    it("Not changing the filter shouldn't call again the service", function() {

        spyOn(instanceResultViewService, 'getResultViewFilteredList').and.returnValue(defer.promise);

        var scope = $rootScope.$new();
        scope.filter = new FifaLeagueClient.Module.Results.ResultViewFilter();
        scope.filter.CountryId = 1;
        var html = angular.element('<latestresultviewshow filter="filter" show="true"></latestresultviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();
        verifyPromiseAndDigest(element.isolateScope().vm, defer, $rootScope);
        // Check that the compiled element contains the templated content
        expect(instanceResultViewService.getResultViewFilteredList).toHaveBeenCalledWith(scope.filter);

        // We change the filter
        scope.filter = new FifaLeagueClient.Module.Results.ResultViewFilter();
        scope.filter.CountryId = 1;

        $rootScope.$digest();
        // We expect no pending request in this case
        expect($http.pendingRequests.length).toEqual(0);
    });


  });


});

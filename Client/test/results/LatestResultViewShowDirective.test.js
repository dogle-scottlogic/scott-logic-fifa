describe('Testing the LatestResultViewShowDirective', function() {
  var $compile,
      $rootScope,
      defer;

  var resultViewService = {};
  var instanceResultViewService;

  // Load the FifaLeagueApp
  beforeEach(module('FifaLeagueApp'));
  beforeEach(module('results'));

  // load the template
  beforeEach(module('templates'));

  var $httpBackend;
  var dataRepository;
  var $http;

  // Mocking the season service
  beforeEach(function() {

    module(function($provide) {
        // Fake seasonService Implementation returning a promise
        $provide.value('resultViewService', resultViewService);

      });
      // defining the method getSeasonFilteredList for the service used by the controller
      resultViewService.getResultViewFilteredList = function(resultViewFilter){
      }

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      $http = $injector.get('$http');
      defer = $q.defer();

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

        it('Show filtered', function() {

            spyOn(instanceResultViewService, 'getResultViewFilteredList').and.returnValue(defer.promise);

            var scope = $rootScope.$new();
            scope.filter = new FifaLeagueClient.Module.Results.ResultViewFilter();
            scope.filter.CountryId = 1;
            var html = angular.element('<latestresultviewshow filter="filter"></latestresultviewshow>');
            var element = $compile(html)(scope);

            $rootScope.$digest();
            verifyPromiseAndDigest(element.isolateScope().vm, defer, $rootScope);
            // Check that the compiled element contains the templated content
            expect(instanceResultViewService.getResultViewFilteredList).toHaveBeenCalledWith(scope.filter);
            expect(instanceResultViewService.getResultViewFilteredList.calls.count()).toEqual(1);
        });

  });


});

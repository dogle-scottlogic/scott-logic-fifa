describe('Testing the TeamPlayerChartViewDirective', function() {
  var $compile,
      $rootScope,
      selectedseason;

  // Load the FifaLeagueApp
  beforeEach(module('FifaLeagueApp'));
  beforeEach(module('team'));

  // load the template
  beforeEach(module('templates'));
  beforeEach(module('cgBusy'));

  var $httpBackend;
  var $http;
  var resultViewService;

  // Mocking the resultViewService service
  beforeEach(function() {

      module(function($provide) {
          // Fake resultViewService Implementation
          $provide.value('resultViewService', resultViewService);
      });
      resultViewService = jasmine.createSpyObj('resultViewService', [ 'getResultViewFilteredList' ]);
      resultViewService.getResultViewFilteredList.and.returnValue(defer.promise);

    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      $http = $injector.get('$http');
    });

  });

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));


  describe(' Tests show directive', function(){
    it('Show at false shouldn t load the teamPlayerChart', function() {
        var scope = $rootScope.$new();
        scope.seasonid = 1;
        scope.teamplayerid = 1;
        scope.show = null;
        var html = angular.element('<teamplayerchartview seasonid="seasonid" teamplayerid="teamplayerid" show="show"></teamplayerchartview>');
        var element = $compile(html)(scope);

        $rootScope.$digest();

        expect($http.pendingRequests.length).toEqual(0);
        expect(resultViewService.getResultViewFilteredList).not.toHaveBeenCalled();
    });

    it('Show at true should load the teamplayerchartview', function() {
        var scope = $rootScope.$new();
        scope.seasonid = 1;
        scope.teamplayerid = 1;
        scope.show = null;
        var html = angular.element('<teamplayerchartview seasonid="seasonid" teamplayerid="teamplayerid" show="show"></teamplayerchartview>');
        var element = $compile(html)(scope);

        $rootScope.$digest();

        expect($http.pendingRequests.length).toEqual(0);

        // expecting that the filter has been called
        var resultFilter = new FifaLeagueClient.Module.Results.ResultViewFilter();
        resultFilter.PlayedMatch = true;
        resultFilter.SeasonId = scope.seasonid;
        resultFilter.TeamPlayerId = scope.teamplayerid;

        scope.show = true;

        $rootScope.$digest();

        expect(resultViewService.getResultViewFilteredList).toHaveBeenCalledWith(resultFilter);
    });

  });


});

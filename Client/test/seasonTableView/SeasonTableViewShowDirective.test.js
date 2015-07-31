describe('Testing the SeasonTableViewShowDirective', function() {
  var $compile,
      $rootScope,
      selectedseason;

  // Load the FifaLeagueApp
  beforeEach(module('FifaLeagueApp'));
  beforeEach(module('seasonTableView'));

  // load the template
  beforeEach(module('templates'));

  var $httpBackend;
  var dataRepository;
  var $http;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = seasonTableView_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      $http = $injector.get('$http');

      seasonTableView_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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


    it('Show filtered', function() {
        var scope = $rootScope.$new();
        scope.filter = new FifaLeagueClient.Module.SeasonTableView.SeasonTableFilter();
        scope.filter.CountryId = 1;
        var html = angular.element('<seasontableviewshow filter="filter" show="true"></seasontableviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();
        verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
        // Check that the compiled element contains the templated content
        expect(element.html()).toContain(dataRepository[0].Name);
        expect(element.html()).not.toContain(dataRepository[1].Name);
    });


  });


});

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

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));


  describe(' Tests show directive', function(){
    it('Show the season', function() {
        var scope = $rootScope.$new();
        var html = angular.element('<seasontableviewshow></seasontableviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();
        verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
        for(var i = 0; i< dataRepository.length;i++){
          // Check that the compiled element contains the templated content
          expect(element.html()).toContain(dataRepository[i].Name);
        }
    });

  });


});

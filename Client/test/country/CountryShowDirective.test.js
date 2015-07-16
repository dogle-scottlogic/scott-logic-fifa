describe('Testing the CountryShowDirective', function() {
  var $compile,
      $rootScope,
      selectedcountry;

  // Load the FifaLeagueApp
  beforeEach(module('FifaLeagueApp'));

  // load the template
  beforeEach(module('templates'));

  var $httpBackend;
  var dataRepository;

  // Mocking the country service
  beforeEach(function() {

    dataRepository = country_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      country_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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
    it('Show the country', function() {
        var scope = $rootScope.$new();
        scope.selectedCountry = 2;
        var html = angular.element('<countryshow countryid="selectedCountry"></countryshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();
        verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
        // Check that the compiled element contains the templated content
        expect(element.html()).toContain('Scotland');
    });

    it('Change the country Id', function() {
        var scope = $rootScope.$new();
        scope.selectedCountry = 2;
        var html = angular.element('<countryshow countryid="selectedCountry"></seasonviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();
        verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);


        scope.selectedCountry = 3;
        $rootScope.$digest();
        verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
        expect(element.html()).toContain('Romania');
    });

  });

});

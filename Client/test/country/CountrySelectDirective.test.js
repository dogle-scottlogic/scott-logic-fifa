describe('Testing the CountrySelectDirective', function() {
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


  describe(' Tests select directive', function(){
    it('Show the selected list', function() {
      // Compile a piece of HTML containing the directive
      var element = $compile("<countryselect selectedcountry='selectedcountry'></countryselect>")($rootScope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      // Check that the compiled element contains the templated content
      expect(element.html()).toContain('France');
      expect(element.html()).toContain('Scotland');
      expect(element.html()).toContain('Romania');
      expect(element.html()).toContain('Italy');

    });

    it('Pre-selected country', function() {
      var scope = $rootScope.$new();
      scope.selectedCountry = 1;
      var html = angular.element('<countryselect selectedcountry="selectedCountry"></countryselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      expect(element.isolateScope().selectedcountry).toBe(scope.selectedCountry);
    });

    it('Selection return scope', function() {
      var scope = $rootScope.$new();
      scope.selectedCountry = 1;
      var html = angular.element('<countryselect selectedcountry="selectedCountry"></countryselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      element.isolateScope().selectedcountry = 2;
      $rootScope.$digest();

      expect(scope.selectedCountry).toBe(element.isolateScope().selectedcountry);

    });


    it('Selection callback', function() {
      var scope = $rootScope.$new();

      // Simulating the callback which will fill the countrySelected with the id of the country
      var countrySelected=0;
      scope.triggerselect = function(country){
        countrySelected = country;
      };

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<countryselect on-select="triggerselect(country)"></countryselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      element.isolateScope().selectedcountry = 2;
      element.isolateScope().vm.select();

      $rootScope.$digest();

      expect(countrySelected).toBe(element.isolateScope().selectedcountry);

    });

  });

});

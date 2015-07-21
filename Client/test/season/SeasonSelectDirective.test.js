describe('Testing the SeasonSelectDirective', function() {
  var $compile,
      $rootScope,
      selectedseason;

  // Load the FifaSaisonApp
  beforeEach(module('FifaLeagueApp'));

  // load the template
  beforeEach(module('templates'));

  var $httpBackend;

  var dataRepository;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = season_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      season_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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
      var element = $compile("<seasonselect selectedseason='selectedseason'></seasonselect>")($rootScope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      // Check that the compiled element contains the templated content
      expect(element.html()).toContain('Season 1');
      expect(element.html()).toContain('Season 2');
      expect(element.html()).toContain('Saison 1');
      expect(element.html()).toContain('Saison 2');

    });

    it('Pre-selected season', function() {
      var scope = $rootScope.$new();
      scope.selectedSeason = 1;
      var html = angular.element('<seasonselect selectedseason="selectedSeason"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      expect(element.isolateScope().selectedseason).toBe(scope.selectedSeason);
    });

    it('Selection return scope', function() {
      var scope = $rootScope.$new();
      scope.selectedSeason = 1;
      var html = angular.element('<seasonselect selectedseason="selectedSeason"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      element.isolateScope().selectedseason = 2;
      $rootScope.$digest();

      expect(scope.selectedSeason).toBe(element.isolateScope().selectedseason);

    });

    it('Selection callback', function() {
      var scope = $rootScope.$new();

      // Simulating the callback which will fill the countrySelected with the id of the country
      var seasonSelected=0;
      scope.triggerselect = function(season){
        seasonSelected = season;
      };

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<seasonselect on-select="triggerselect(season)"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      element.isolateScope().selectedseason = 2;
      element.isolateScope().vm.select();

      $rootScope.$digest();

      expect(seasonSelected).toBe(element.isolateScope().selectedseason);

    });

    it('Country filter intialized', function() {
      var scope = $rootScope.$new();
      scope.filtercountry=1;

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<seasonselect filtercountry="filtercountry"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).toContain('Season 2');
      expect(element.html()).not.toContain('Saison 1');

    });


    it('Country filter after initialized', function() {
      var scope = $rootScope.$new();

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<seasonselect filtercountry="filtercountry"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).toContain('Season 2');
      expect(element.html()).toContain('Saison 1');
      expect(element.html()).toContain('Saison 2');

      // After the initialisation, we change the filtercountry so the Saison 1 shall disappear
      scope.filtercountry=1;
      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).toContain('Season 2');
      expect(element.html()).not.toContain('Saison 1');

    });


    it('HavingSaison filter intialized', function() {
      var scope = $rootScope.$new();
      scope.havingleague=false;

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<seasonselect filterhavingleague="havingleague"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).toContain('Saison 1');
      expect(element.html()).not.toContain('Season 2');
      expect(element.html()).not.toContain('Saison 2');

    });

    it('HavingSaison filter changed', function() {
      var scope = $rootScope.$new();

      var html = angular.element('<seasonselect filterhavingleague="havingleague"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).toContain('Season 2');
      expect(element.html()).toContain('Saison 1');
      expect(element.html()).toContain('Saison 2');

      scope.havingleague=false;
      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).toContain('Saison 1');
      expect(element.html()).not.toContain('Season 2');
      expect(element.html()).not.toContain('Saison 2');

    });

    it('Filterhasremainingmatchtoplay filter intialized', function() {
      var scope = $rootScope.$new();
      scope.filterhasremainingmatchtoplay=true;

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<seasonselect filterhasremainingmatchtoplay="filterhasremainingmatchtoplay"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).not.toContain('Saison 1');
      expect(element.html()).not.toContain('Season 2');
      expect(element.html()).not.toContain('Saison 2');

    });

    it('Filterhasremainingmatchtoplay filter changed', function() {
      var scope = $rootScope.$new();
      scope.filterhasremainingmatchtoplay=null;

      var html = angular.element('<seasonselect filterhasremainingmatchtoplay="filterhasremainingmatchtoplay"></seasonselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).toContain('Season 2');
      expect(element.html()).toContain('Saison 1');
      expect(element.html()).toContain('Saison 2');

      scope.filterhasremainingmatchtoplay=true;
      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('Season 1');
      expect(element.html()).not.toContain('Saison 1');
      expect(element.html()).not.toContain('Season 2');
      expect(element.html()).not.toContain('Saison 2');

    });


  });

});

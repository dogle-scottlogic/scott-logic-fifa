describe('Testing the LeagueSelectDirective', function() {
  var $compile,
      $rootScope,
      selectedleague;

  // Load the FifaSaisonApp
  beforeEach(module('FifaLeagueApp'));

  // load the template
  beforeEach(module('templates'));

  var $httpBackend;

  var dataRepository;

  // Mocking the league service
  beforeEach(function() {

    dataRepository = league_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      league_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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
      var element = $compile("<leagueselect selectedleague='selectedleague'></leagueselect>")($rootScope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      // Check that the compiled element contains the templated content
      expect(element.html()).toContain('League 1');
      expect(element.html()).toContain('League 2');
      expect(element.html()).toContain('Ligue 1');
      expect(element.html()).toContain('Ligue 2');

    });

    it('Pre-selected league', function() {
      var scope = $rootScope.$new();
      scope.selectedLeague = 1;
      var html = angular.element('<leagueselect selectedleague="selectedLeague"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      expect(element.isolateScope().selectedleague).toBe(scope.selectedLeague);
    });

    it('Selection return scope', function() {
      var scope = $rootScope.$new();
      scope.selectedLeague = 1;
      var html = angular.element('<leagueselect selectedleague="selectedLeague"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      element.isolateScope().selectedleague = 2;
      $rootScope.$digest();

      expect(scope.selectedLeague).toBe(element.isolateScope().selectedleague);

    });

    it('Selection callback', function() {
      var scope = $rootScope.$new();

      // Simulating the callback which will fill the countrySelected with the id of the country
      var leagueSelected=0;
      scope.triggerselect = function(league){
        leagueSelected = league;
      };

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<leagueselect on-select="triggerselect(league)"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      element.isolateScope().selectedleague = 2;
      element.isolateScope().vm.select();

      $rootScope.$digest();

      expect(leagueSelected).toBe(element.isolateScope().selectedleague);

    });

    it('Country filter intialized', function() {
      var scope = $rootScope.$new();
      scope.filtercountry=1;

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<leagueselect filtercountry="filtercountry"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).not.toContain('League 1');
      expect(element.html()).not.toContain('League 2');
      expect(element.html()).toContain('Ligue 1');
      expect(element.html()).toContain('Ligue 2');

    });


    it('Country filter after initialized', function() {
      var scope = $rootScope.$new();

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<leagueselect filtercountry="filtercountry"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('League 1');
      expect(element.html()).toContain('League 2');
      expect(element.html()).toContain('Ligue 1');
      expect(element.html()).toContain('Ligue 2');

      // After the initialisation, we change the filtercountry so the Saison 1 shall disappear
      scope.filtercountry=1;
      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).not.toContain('League 1');
      expect(element.html()).not.toContain('League 2');
      expect(element.html()).toContain('Ligue 1');
      expect(element.html()).toContain('Ligue 2');

    });


    it('Filterseason filter initialized', function() {
      var scope = $rootScope.$new();
      scope.filterseason=1;

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<leagueselect filterseason="filterseason"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).not.toContain('League 1');
      expect(element.html()).not.toContain('Ligue 1');
      expect(element.html()).toContain('League 2');
      expect(element.html()).toContain('Ligue 2');

    });

    it('Filterseason filter changed', function() {
      var scope = $rootScope.$new();
      scope.filterseason=1;

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<leagueselect filterseason="filterseason"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).not.toContain('League 1');
      expect(element.html()).not.toContain('Ligue 1');
      expect(element.html()).toContain('League 2');
      expect(element.html()).toContain('Ligue 2');

      scope.filterseason=2;
      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).not.toContain('League 1');
      expect(element.html()).not.toContain('League 2');
      expect(element.html()).toContain('Ligue 1');
      expect(element.html()).not.toContain('Ligue 2');

    });

    it('Filterhasremainingmatchtoplay filter initialized', function() {
      var scope = $rootScope.$new();
      scope.filterhasremainingmatchtoplay=true;

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<leagueselect filterhasremainingmatchtoplay="filterhasremainingmatchtoplay"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('League 1');
      expect(element.html()).not.toContain('Ligue 1');
      expect(element.html()).not.toContain('League 2');
      expect(element.html()).not.toContain('Ligue 2');

    });

    it('Filterhasremainingmatchtoplay filter changed', function() {
      var scope = $rootScope.$new();
      scope.filterhasremainingmatchtoplay=null;

      // defining the directive which call back to scope.triggerselect function
      var html = angular.element('<leagueselect filterhasremainingmatchtoplay="filterhasremainingmatchtoplay"></leagueselect>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('League 1');
      expect(element.html()).toContain('Ligue 1');
      expect(element.html()).toContain('League 2');
      expect(element.html()).toContain('Ligue 2');

      scope.filterhasremainingmatchtoplay=true;
      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
      expect(element.html()).toContain('League 1');
      expect(element.html()).not.toContain('Ligue 1');
      expect(element.html()).not.toContain('League 2');
      expect(element.html()).not.toContain('Ligue 2');

    });



  });

});

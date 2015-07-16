describe('Testing the CountryShowController in error', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var countryShowController;
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

      country_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    countryShowController = $controller(FifaLeagueClient.Module.Country.CountryShowController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('CountryShowController in error case : ', function(){

  // Get test
    it('Try getting a country but have an error', function () {
      // And that we clicked a button or something
      countryShowController.loadCountry(2);
      verifyPromiseAndFlush(countryShowController, $httpBackend);
      expect(countryShowController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });


  });


});

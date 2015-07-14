describe('Testing the CountryAddController in error', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var countryAddController;
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

    countryAddController = $controller(FifaLeagueClient.Module.Country.CountryAddController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('CountryAddController in error case : ', function(){

    it('Try creating a new country with an already existing name', function () {
      // We simulate we entered a new Country
      countryAddController.country.Name = "Spain";
      // And that we clicked a button or something
      countryAddController.addCountry();
      verifyPromiseAndFlush(countryAddController, $httpBackend);

      expect(countryAddController.errors["item.Global"]).toEqual([ '400 : ', 'The country name already exists' ]);
    });

  });

});

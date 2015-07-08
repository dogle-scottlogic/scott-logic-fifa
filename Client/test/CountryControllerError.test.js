describe('Testing the CountryController in error', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var countryController;
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

    countryController = $controller(FifaLeagueClient.Module.Country.CountryController,
        {$scope: scope});

    // Initialize the list of the countries
    countryController.fillCountries();
    verifyPromiseAndFlush(countryController, $httpBackend);

    scope.$digest();
  }));

  describe('CountryController in error case : ', function(){

    it('should contain an error', function() {
      expect(countryController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
    });

  // Get test
    it('Try getting a country but have an error', function () {
      // And that we clicked a button or something
      countryController.loadCountry(2);
      verifyPromiseAndFlush(countryController, $httpBackend);
      expect(countryController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

    it('Try creating a new country with an already existing name', function () {
      // We simulate we entered a new Country
      countryController.country.Name = "Spain";
      // And that we clicked a button or something
      countryController.addCountry();
      verifyPromiseAndFlush(countryController, $httpBackend);

      expect(countryController.errors["item.Global"]).toEqual([ '400 : ', 'The country name already exists' ]);
    });

    it('Try update a country with an already existing name', function () {
      // We simulate we change a country
      countryController.country.Id = 1;
      countryController.country.Name = "Francia";
      // And that we clicked a button or something
      countryController.updateCountry();
      verifyPromiseAndFlush(countryController, $httpBackend);

      expect(countryController.errors["item.Global"]).toEqual([ '400 : ', 'The country name already exists' ]);
    });

    it('Try deleting a country which not exists', function () {

      var nbRow = countryController.countries.length;

      // And that we clicked a button or something
      countryController.deleteCountry(2);
      verifyPromiseAndFlush(countryController, $httpBackend);

      expect(countryController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

  });


});

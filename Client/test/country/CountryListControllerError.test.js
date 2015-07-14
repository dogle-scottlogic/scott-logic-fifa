describe('Testing the CountryListController in error', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var countryListController;
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

    countryListController = $controller(FifaLeagueClient.Module.Country.CountryListController,
        {$scope: scope});

    // Initialize the list of the countries
    countryListController.showCountries();
    verifyPromiseAndFlush(countryListController, $httpBackend);

    scope.$digest();
  }));

  describe('CountryListController in error case : ', function(){

    it('should contain an error', function() {
      expect(countryListController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
    });

    it('Try deleting a country which not exists', function () {

      var nbRow = countryListController.countries.length;

      // And that we clicked a button or something
      countryListController.deleteCountry(2);
      verifyPromiseAndFlush(countryListController, $httpBackend);

      expect(countryListController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

  });


});

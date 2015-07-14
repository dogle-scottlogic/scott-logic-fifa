describe('Testing the CountryEditController in error', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
  beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

  var countryEditController;
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

    countryEditController = $controller(FifaLeagueClient.Module.Country.CountryEditController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('CountryEditController in error case : ', function(){

  // Get test
    it('Try getting a country but have an error', function () {
      countryEditController.id = 2;
      // And that we clicked a button or something
      countryEditController.loadCountry();
      verifyPromiseAndFlush(countryEditController, $httpBackend);
      expect(countryEditController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
    });

    it('Try update a country with an already existing name', function () {

      countryEditController.country = new FifaLeagueClient.Module.Country.CountryModel();
      // We simulate we change a country
      countryEditController.country.Id = 1;
      countryEditController.country.Name = "Francia";
      // And that we clicked a button or something
      countryEditController.updateCountry();
      verifyPromiseAndFlush(countryEditController, $httpBackend);

      expect(countryEditController.errors["item.Global"]).toEqual([ '400 : ', 'The country name already exists' ]);
    });

  });


});

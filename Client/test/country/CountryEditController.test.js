describe('Testing the CountryEditController', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      country_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    countryEditController = $controller(FifaLeagueClient.Module.Country.CountryEditController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('countryEditController in normal case (no error) : ', function(){
  // Get test
    it('should get a country', function () {

      countryEditController.id = 2;
      // And that we clicked a button or something
      countryEditController.loadCountry();
      verifyPromiseAndFlush(countryEditController, $httpBackend);

      var countryLoaded = countryEditController.country;
      expect(countryLoaded).toEqual(dataRepository[1]);
    });

    it('should update country and append it to the database', function () {

      countryEditController.country = new FifaLeagueClient.Module.Country.CountryModel();
      // We simulate we change a country
      countryEditController.country.Id = 1;
      countryEditController.country.Name = "Francia";

      // And that we clicked a button or something
      countryEditController.updateCountry();
      verifyPromiseAndFlush(countryEditController, $httpBackend);

      var updatedCountry = dataRepository[0];
      expect(updatedCountry.Name).toEqual(countryEditController.country.Name);
    });


  });


});

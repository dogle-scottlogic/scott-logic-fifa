describe('Testing the CountryController', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      country_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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

  // Verify if the controller contain the list of countries
  describe('Filling the list on init', function(){

    it('should contain all the countries at initialize', function() {
      expect(countryController.countries).toEqual(dataRepository);
    });


  // Get test
    it('should get a country', function () {

      // And that we clicked a button or something
      countryController.loadCountry(2);
      verifyPromiseAndFlush(countryController, $httpBackend);

      var countryLoaded = countryController.country;
      console.log(countryLoaded);
      expect(countryLoaded).toEqual(dataRepository[1]);
    });

    it('should create new country and append it to the list', function () {
      // We simulate we entered a new Country
      countryController.country.Name = "Spain";

      // And that we clicked a button or something
      countryController.addCountry();
      verifyPromiseAndFlush(countryController, $httpBackend);

      var lastCountry = countryController.countries[countryController.countries.length - 1];
      console.log(lastCountry);
      expect(lastCountry.Name).toEqual(countryController.country.Name);
    });

    it('should update country and append it to the list', function () {
      // We simulate we change a country
      countryController.country.Id = 1;
      countryController.country.Name = "Francia";

      // And that we clicked a button or something
      countryController.updateCountry();
      verifyPromiseAndFlush(countryController, $httpBackend);

      var updatedCountry = countryController.countries[0];
      console.log(updatedCountry);
      expect(updatedCountry.Name).toEqual(countryController.country.Name);
    });

    it('should delete country', function () {

      var nbRow = countryController.countries.length;

      // And that we clicked a button or something
      countryController.deleteCountry(2);
      verifyPromiseAndFlush(countryController, $httpBackend);

      var nbRowAfterDelete = countryController.countries.length;
      console.log(nbRowAfterDelete);
      expect(nbRow).toEqual(nbRowAfterDelete + 1);
    });

  });


});

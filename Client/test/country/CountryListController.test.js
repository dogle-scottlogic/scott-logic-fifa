describe('Testing the CountryListController', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      country_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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

  describe('CountryListController in normal case (no error) : ', function(){

    it('should contain all the countries at initialize', function() {
      expect(countryListController.countries).toEqual(dataRepository);
    });

  });


    it('should delete country', function () {

      var nbRow = countryListController.countries.length;

      // And that we clicked a button or something
      countryListController.deleteCountry(2);
      verifyPromiseAndFlush(countryListController, $httpBackend);

      var nbRowAfterDelete = countryListController.countries.length;
      expect(nbRow).toEqual(nbRowAfterDelete + 1);
    });


});

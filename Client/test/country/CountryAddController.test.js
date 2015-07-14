describe('Testing the CountryAddController', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      country_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    countryAddController = $controller(FifaLeagueClient.Module.Country.CountryAddController,
        {$scope: scope});

    scope.$digest();
  }));

  describe('countryAddController in normal case (no error) : ', function(){

    it('Should create new country', function () {
      // We simulate we entered a new Country
      countryAddController.country.Name = "Spain";

      // And that we clicked a button or something
      countryAddController.addCountry();
      verifyPromiseAndFlush(countryAddController, $httpBackend);

      var lastCountry = dataRepository[dataRepository.length - 1];
      expect(lastCountry.Name).toEqual(countryAddController.country.Name);
    });

  });


});

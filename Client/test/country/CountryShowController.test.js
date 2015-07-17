describe('Testing the CountryShowController', function() {
  beforeEach(module('country'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

      country_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    countryShowController = $controller(FifaLeagueClient.Module.Country.CountryShowController,
        {$scope: scope});

    scope.$digest();
  }));


  describe('countryShowController in normal case (no error) : ', function(){
  // Get test
    it('should get a country', function () {

      // And that we clicked a button or something
      countryShowController.loadCountry(2);
      verifyPromiseAndFlush(countryShowController, $httpBackend);

      var countryLoaded = countryShowController.country;
      expect(countryLoaded).toEqual(dataRepository[1]);
    });


  });


});

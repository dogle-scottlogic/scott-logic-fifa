describe('Testing the CountrySelectController', function() {
    beforeEach(module('country'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

    var countrySelectController;
    var $httpBackend;

    var dataRepository;
    var mockedCountryGetList;

    // Mocking the country service
    beforeEach(function() {

      dataRepository = country_buildDataRepository();

      // Mocking the datas
      inject(function($injector) {

        config = $injector.get(FifaLeagueClient.Module.Common.configService);
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');

        mockedCountryGetList = country_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
      });

    });

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();

      countrySelectController = $controller(FifaLeagueClient.Module.Country.CountrySelectController,
          {$scope: scope});


      // Initialize the list of the countries
      countrySelectController.getCountryList();
      verifyPromiseAndFlush(countrySelectController, $httpBackend);

      scope.$digest();
    }));

    describe('CountrySelectController in normal case (no error) : ', function(){

      it('should contain all the countries at initialize', function() {
        expect(countrySelectController.countries).toEqual(dataRepository);
      });

    });


    it('Shall select automatically the element if it is alone in the list', function () {

      // We the mocked get list in order to have only one element
      dataRepository = [dataRepository[0]];
      mockedCountryGetList.respond(function (method, url, data, headers) {
          return [200,dataRepository];
      });

      countrySelectController.getCountryList();
      verifyPromiseAndFlush(countrySelectController, $httpBackend);

      expect(countrySelectController.scope.selectedcountry).toEqual(dataRepository[0].Id);
    });


});

describe('Testing the CountrySelectController in error', function() {
    beforeEach(module('country'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var countrySelectController;
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

      countrySelectController = $controller(FifaLeagueClient.Module.Country.CountrySelectController,
          {$scope: scope});

      // Initialize the list of the countries
      countrySelectController.getCountryList();
      verifyPromiseAndFlush(countrySelectController, $httpBackend);

      scope.$digest();
    }));

    describe('CountrySelectController in error case : ', function(){

      it('should contain an error', function() {
        expect(countrySelectController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
      });

    });


});

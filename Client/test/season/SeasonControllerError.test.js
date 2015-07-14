describe('Testing the SeasonController in error', function() {
    beforeEach(module(FifaLeagueClient.Module.Season.moduleName));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var seasonController;
    var $httpBackend;

    var dataRepository;

    // Mocking the season service
    beforeEach(function() {

        dataRepository = season_buildDataRepository();

        // Mocking the datas
        inject(function($injector) {

            config = $injector.get(FifaLeagueClient.Module.Common.configService);
            $httpBackend = $injector.get('$httpBackend');
            $q = $injector.get('$q');

            season_mockHTTPBackend_Error(config, $httpBackend, $q, dataRepository);
        });

    });

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();

        seasonController = $controller(FifaLeagueClient.Module.Season.SeasonController,
            {$scope: scope});


        // Initialize the list of the seasons
        seasonController.fillSeasons();
        verifyPromiseAndFlush(seasonController, $httpBackend);

        scope.$digest();
    }));

    // Verify if the controller contain the list of seasons
    describe('CountryController in  error :', function(){

        it('should contain an error', function() {
            expect(seasonController.errors["item.Global"]).toEqual([ 'The server is unreachable' ]);
        });


        // Get test
        it("Try getting a season that doesn't exists", function () {

            // loading a season
            seasonController.loadSeason(2);
            verifyPromiseAndFlush(seasonController, $httpBackend);

            var seasonLoaded = seasonController.season;
            expect(seasonController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
        });

        it('Try creating a new season with an already existing name', function () {
            // We simulate we entered a new Country
            seasonController.season.CountryId = 1;
            seasonController.season.Name = "Ligue 3";

            // And that we clicked a button or something
            seasonController.addSeason();
            verifyPromiseAndFlush(seasonController, $httpBackend);
            expect(seasonController.errors["item.Global"]).toEqual([ '400 : ', 'The season name already exists' ]);
        });

        it('Try updating a new season with an already existing name', function () {
            // We simulate we change a season
            seasonController.season.Id = 1;
            seasonController.season.CountryId = 1;
            seasonController.season.Name = "Ligue_1";

            // And that we clicked a button or something
            seasonController.updateSeason();
            verifyPromiseAndFlush(seasonController, $httpBackend);
            expect(seasonController.errors["item.Global"]).toEqual([ '400 : ', 'The season name already exists' ]);
        });

        it("Try deleting a season that doesn't exists", function () {

            var nbRow = seasonController.seasons.length;

            // And that we clicked a button or something
            seasonController.deleteSeason(2);
            verifyPromiseAndFlush(seasonController, $httpBackend);
            expect(seasonController.errors["item.Global"]).toEqual([ '404 : ', 'Not Found' ]);
        });

    });


});

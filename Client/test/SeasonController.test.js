describe('Testing the SeasonController', function() {
    beforeEach(module(FifaLeagueClient.Module.Season.moduleName));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

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

            season_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
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
    describe('Filling the list on init', function(){

        it('should contain all the seasons at initialize', function() {
            expect(seasonController.seasons).toEqual(dataRepository);
        });


        // Get test
        it('should get a season', function () {

            // loading a season
            seasonController.loadSeason(2);
            verifyPromiseAndFlush(seasonController, $httpBackend);

            var seasonLoaded = seasonController.season;
            console.log(seasonLoaded);
            expect(seasonLoaded).toEqual(dataRepository[1]);
        });

        it('should create new seasons and append it to the list', function () {
            // We simulate we entered a new Country
            seasonController.season.CountryId = 1;
            seasonController.season.Name = "Ligue 3";

            // And that we clicked a button or something
            seasonController.addSeason();
            verifyPromiseAndFlush(seasonController, $httpBackend);

            var lastSeason = seasonController.seasons[seasonController.seasons.length - 1];
            console.log(lastSeason);
            expect(lastSeason.Name).toEqual(seasonController.season.Name);
        });

        it('should update season and append it to the list', function () {
            // We simulate we change a season
            seasonController.season.Id = 1;
            seasonController.season.CountryId = 1;
            seasonController.season.Name = "Ligue_1";

            // And that we clicked a button or something
            seasonController.updateSeason();
            verifyPromiseAndFlush(seasonController, $httpBackend);

            var updatedSeason = seasonController.seasons[0];
            console.log(updatedSeason);
            expect(updatedSeason.Name).toEqual(seasonController.season.Name);
        });

        it('should delete season', function () {

            var nbRow = seasonController.seasons.length;

            // And that we clicked a button or something
            seasonController.deleteSeason(2);
            verifyPromiseAndFlush(seasonController, $httpBackend);

            var nbRowAfterDelete = seasonController.seasons.length;
            console.log(nbRowAfterDelete);
            expect(nbRow).toEqual(nbRowAfterDelete + 1);
        });

    });


});

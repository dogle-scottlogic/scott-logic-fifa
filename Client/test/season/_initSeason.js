// Season INIT

// build a dataRepository with the seasons
season_buildDataRepository = function() {
    return [new FifaLeagueClient.Module.Season.SeasonModel(
        {
            Id: 1,
            CountryId: 1,
            Name: 'Ligue 1'
        }),
        new FifaLeagueClient.Module.Season.SeasonModel({
            Id: 2,
            CountryId: 1,
            Name: 'Ligue 2'
        }),
        new FifaLeagueClient.Module.Season.SeasonModel({
            Id: 3,
            CountryId: 2,
            Name: 'League 1'
        }),
        new FifaLeagueClient.Module.Season.SeasonModel({
            Id: 4,
            CountryId: 2,
            Name: 'League 2'
        })
    ];
}

// mocking the backend
season_mockHTTPBackend = function(config, $httpBackend, $q, dataRepository){

    $httpBackend.whenGET(config.backend+"api/Season/")
        .respond(function (method, url, data, headers) {
            return [200,dataRepository];
        });

    $httpBackend.whenGET(config.backend+"api/Season/2")
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("/");
            var IdToGet = parseInt(splitedURL[splitedURL.length -1]);
            var seasonToReturn = null;
            for(var i=0; i<dataRepository.length;i++)
            {
                var season = dataRepository[i];
                if (season.Id == IdToGet) {
                    seasonToReturn = season;
                }
            }
            return [200,seasonToReturn];

        });


    $httpBackend.whenGET(config.backend+"api/Season?CountryId=1")
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("=");
            var IdToGet = parseInt(splitedURL[splitedURL.length -1]);

            var item = [];

            for(var i=0; i<dataRepository.length;i++)
            {
                var season = dataRepository[i];
                if (season.CountryId == IdToGet) {
                    item.push(season);
                }
            }
            return [200,item];
        });

    $httpBackend.whenPOST(config.backend+"api/Season/")
        .respond(function (method, url, data, headers) {

            var Id = dataRepository.length + 1;
            // Retrieving the name which is in a string sadely :/
            var dataSplited = data.split("\"");
            var countryId = dataSplited[dataSplited.length-4];
            var name = dataSplited[dataSplited.length-2];

            var item = new FifaLeagueClient.Module.Season.SeasonModel({
                Id: Id,
                CountryId: countryId,
                Name: name
            });

            dataRepository.push(item);

            return [200,item];
        });


    $httpBackend.whenPUT(config.backend+"api/Season/1")
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("/");
            var IdToPUT = parseInt(splitedURL[splitedURL.length -1]);

            // Retrieving the name which is in a string sadely :/
            var dataSplited = data.split("\"");
            var countryId = dataSplited[dataSplited.length-4];
            var name = dataSplited[dataSplited.length-2];

            var item = new FifaLeagueClient.Module.Season.SeasonModel({
                Id: IdToPUT,
                CountryId: countryId,
                Name: name
            });

            for(var i=0; i<dataRepository.length;i++)
            {
                var season = dataRepository[i];
                if (season.Id == IdToPUT) {
                    dataRepository[i] = item;
                }
            }
            return [200,item];
        });

    $httpBackend.whenDELETE(config.backend+"api/Season/2")
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("/");
            var IdToDELETE = parseInt(splitedURL[splitedURL.length -1]);

            var dataBck = [];
            for(var i=0; i<dataRepository.length;i++)
            {
                var season = dataRepository[i];
                if (season.Id != IdToDELETE) {
                    dataBck.push(season);
                }
            }
            dataRepository = dataBck;

            return [200,true];
        });

}


// mocking the backend in error case
season_mockHTTPBackend_Error = function(config, $httpBackend, $q, dataRepository){

    $httpBackend.whenGET(config.backend+"api/Season/")
        .respond(0,{status:0});

    $httpBackend.whenGET(config.backend+"api/Season/2")
        .respond(404,{Message: 'Not Found'});

    $httpBackend.whenPOST(config.backend+"api/Season/")
        .respond(400,{Message: 'The season name already exists'});


    $httpBackend.whenPUT(config.backend+"api/Season/1")
        .respond(400,{Message: 'The season name already exists'});

    $httpBackend.whenDELETE(config.backend+"api/Season/2")
        .respond(404,{Message: 'Not Found'});

}

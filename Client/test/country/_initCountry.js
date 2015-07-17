// COUNTRY INIT

// build a dataRepository with the countries
country_buildDataRepository = function() {
    return [new FifaLeagueClient.Module.Country.CountryModel(
        {
            Id: 1,
            Name: 'France'
        }),
        new FifaLeagueClient.Module.Country.CountryModel({
            Id: 2,
            Name: 'Scotland'
        }),
        new FifaLeagueClient.Module.Country.CountryModel({
            Id: 3,
            Name: 'Romania'
        }),
        new FifaLeagueClient.Module.Country.CountryModel({
            Id: 4,
            Name: 'Italy'
        })
    ];
}

// mocking the backend in normal case
country_mockHTTPBackend = function(config, $httpBackend, $q, dataRepository){

    var mockedCountryGetList = $httpBackend.whenGET(config.backend+"api/Country/")
        .respond(function (method, url, data, headers) {
            return [200,dataRepository];
        });

    $httpBackend.whenGET(/\/api\/Country\/[1-9][0-9]*/)
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("/");
            var IdToGet = parseInt(splitedURL[splitedURL.length -1]);
            var countryToReturn = null;
            for(var i=0; i<dataRepository.length;i++)
            {
                var country = dataRepository[i];
                if (country.Id == IdToGet) {
                    countryToReturn = country;
                }
            }
            return [200,countryToReturn];

        });

    $httpBackend.whenPOST(config.backend+"api/Country/")
        .respond(function (method, url, data, headers) {

            var Id = dataRepository.length + 1;
            // Retrieving the name which is in a string sadely :/
            var dataSplited = data.split("\"");
            var name = dataSplited[dataSplited.length-2];

            var item = new FifaLeagueClient.Module.Country.CountryModel({
                Id: Id,
                Name: name
            });

            dataRepository.push(item);

            return [200,item];
        });


    $httpBackend.whenPUT(/\/api\/Country\/[1-9][0-9]*/)
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("/");
            var IdToPUT = parseInt(splitedURL[splitedURL.length -1]);
            // Retrieving the name which is in a string sadely :/
            var dataSplited = data.split("\"");

            var name = dataSplited[dataSplited.length-2];
            var item = new FifaLeagueClient.Module.Country.CountryModel({
                Id: IdToPUT,
                Name: name
            });

            for(var i=0; i<dataRepository.length;i++)
            {
                var country = dataRepository[i];
                if (country.Id == IdToPUT) {
                    dataRepository[i] = item;
                }
            }
            return [200,item];
        });

    $httpBackend.whenDELETE(/\/api\/Country\/[1-9][0-9]*/)
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("/");
            var IdToDELETE = parseInt(splitedURL[splitedURL.length -1]);

            var dataBck = [];
            for(var i=0; i<dataRepository.length;i++)
            {
                var country = dataRepository[i];
                if (country.Id != IdToDELETE) {
                    dataBck.push(country);
                }
            }
            dataRepository = dataBck;

            return [200,true];
        });

    return mockedCountryGetList;

}

// mocking the backend in error case
country_mockHTTPBackend_Error = function(config, $httpBackend, $q, dataRepository){

    $httpBackend.whenGET(config.backend+"api/Country/")
        .respond(0,{status:0});

    $httpBackend.whenGET(/\/api\/Country\/[1-9][0-9]*/)
        .respond(404,{Message: 'Not Found'});

    $httpBackend.whenPOST(config.backend+"api/Country/")
        .respond(400,{Message: 'The country name already exists'});


    $httpBackend.whenPUT(/\/api\/Country\/[1-9][0-9]*/)
        .respond(400,{Message: 'The country name already exists'});

    $httpBackend.whenDELETE(/\/api\/Country\/[1-9][0-9]*/)
        .respond(404,{Message: 'Not Found'});

}

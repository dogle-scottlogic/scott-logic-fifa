// League INIT

// build a dataRepository with the leagues
league_buildDataRepository = function() {
    return [new FifaLeagueClient.Module.League.LeagueModel(
        {
            Id: 1,
            Name: 'League 1'
        }),
        new FifaLeagueClient.Module.League.LeagueModel({
            Id: 2,
            Name: 'League 2'
        }),
        new FifaLeagueClient.Module.League.LeagueModel({
            Id: 3,
            Name: 'Ligue 1'
        }),
        new FifaLeagueClient.Module.League.LeagueModel({
            Id: 4,
            Name: 'Ligue 2'
        })
    ];
}

getLeague = function(dataRepository, Id){
  var leagueToReturn = null;
  for(var i=0; i<dataRepository.length;i++)
  {
      var league = dataRepository[i];
      if (league.Id == Id) {
          leagueToReturn = league;
      }
  }
  return leagueToReturn;
}

// The country 1 got the element 2 and 3
getCountry1Leagues = function(dataRepository){
  return [dataRepository[2], dataRepository[3]];
}

// The season 1 got the element 1
getSeason1Leagues = function(dataRepository){
  return [dataRepository[1],dataRepository[3]];
}

getSeason2Leagues = function(dataRepository){
  return [dataRepository[2]];
}

getLeaguesHasRemainingMatchToPlay = function(dataRepository){
  return [dataRepository[0]];
}


// mocking the backend
league_mockHTTPBackend = function(config, $httpBackend, $q, dataRepository){

    var mockedLeagueGetList = $httpBackend.whenGET(config.backend+"api/League/")
        .respond(function (method, url, data, headers) {
            return [200,dataRepository];
        });

    $httpBackend.whenGET(/\/api\/League\/[1-9][0-9]*/)
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("/");
            var IdToGet = parseInt(splitedURL[splitedURL.length -1]);
            return [200,getLeague(dataRepository, IdToGet)];

        });

    $httpBackend.whenGET(config.backend+"api/League?CountryId=1")
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("=");
            var IdToGet = parseInt(splitedURL[splitedURL.length -1]);

            var item = getCountry1Leagues(dataRepository);

            return [200,item];
        });


    $httpBackend.whenGET(config.backend+"api/League?SeasonId=1")
        .respond(function (method, url, data, headers) {

            var item = getSeason1Leagues(dataRepository);

            return [200,item];
        });


    $httpBackend.whenGET(config.backend+"api/League?SeasonId=2")
        .respond(function (method, url, data, headers) {

            var item = getSeason2Leagues(dataRepository);

            return [200,item];
        });

    $httpBackend.whenGET(config.backend+"api/League?HasRemainingMatchToPlay=true")
        .respond(function (method, url, data, headers) {

            var item = getLeaguesHasRemainingMatchToPlay(dataRepository);

            return [200,item];
        });

    return mockedLeagueGetList;

}


// mocking the backend in error case
league_mockHTTPBackend_Error = function(config, $httpBackend, $q, dataRepository){

    $httpBackend.whenGET(config.backend+"api/League/")
        .respond(0,{status:0});

    $httpBackend.whenGET(/\/api\/League\/[1-9][0-9]*/)
        .respond(404,{Message: 'Not Found'});

}

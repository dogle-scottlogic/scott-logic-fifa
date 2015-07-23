// Season INIT

// build a dataRepository with the teamPlayerStatisticView
teamPlayerStatisticView_buildDataRepository = function() {
    return [new FifaLeagueClient.Module.Team.TeamPlayerStatisticViewModel(
        {
          Id: 1,
          teamName: "Team 1",
          playerName: "Player 1",
          seasonId: 1,
          seasonName: "Season 1",
          nbAverageGoals: 1.5,
          lastPlayedMatch:{
            Id: 1,
            leagueId:1,
            leagueName:"League 1",
            homeTeam:"Team 1",
            awayTeam:"Away team 1",
            homeNbGoals:1,
            awayNbGoals:0,
            dateMatch:new Date(2015,01,01)
          },
          nextMatch:{
              Id: 2,
              leagueId:1,
              leagueName:"League 1",
              homeTeam:"Away Team 4",
              awayTeam:"Team 1",
              homeNbGoals:null,
              awayNbGoals:null,
              dateMatch:new Date(2016,01,01)
          }
        }),
        new FifaLeagueClient.Module.Team.TeamPlayerStatisticViewModel(
          {
            Id: 2,
            teamName: "Team 2",
            playerName: "Player 2",
            seasonId: 2,
            seasonName: "Season 2",
            nbAverageGoals: 3
        }),
        new FifaLeagueClient.Module.Team.TeamPlayerStatisticViewModel(
          {
            Id: 3,
            teamName: "Team 3",
            playerName: "Player 3",
            seasonId: 3,
            seasonName: "Season 3",
            nbAverageGoals: 4
        }),
        new FifaLeagueClient.Module.Team.TeamPlayerStatisticViewModel(
          {
            Id: 1,
            teamName: "Team 1",
            playerName: "Player 1",
            seasonId: 4,
            seasonName: "Season 4",
            nbAverageGoals: 5
        }),
    ];
}

getTeamPlayerStat = function(dataRepository, Id, seasonId){
  var teamPlayerStatToReturn = null;
  for(var i=0; i<dataRepository.length;i++)
  {
      var tps = dataRepository[i];
      if (tps.Id == Id && tps.seasonId == seasonId) {
          teamPlayerStatToReturn = tps;
      }
  }
  return teamPlayerStatToReturn;
}


// mocking the backend
teamPlayerStatisticView_mockHTTPBackend = function(config, $httpBackend, $q, dataRepository){

    $httpBackend.whenGET(/\/api\/TeamPlayerStatisticView\?idTeamPlayer=.*/)
        .respond(function (method, url, data, headers) {

            var splitedURL = url.split("=");
            var splitedId = splitedURL[splitedURL.length -2].split("&");
            var IdToGet = parseInt(splitedId[0]);
            var IdSeasonToGet = parseInt(splitedURL[splitedURL.length -1]);
            return [200,getTeamPlayerStat(dataRepository, IdToGet, IdSeasonToGet)];

        });

}


// mocking the backend in error case
teamPlayerStatisticView_mockHTTPBackend_Error = function(config, $httpBackend, $q, dataRepository){

    $httpBackend.whenGET(/\/api\/TeamPlayerStatisticView\?idTeamPlayer=.*/)
        .respond(0,{status:0});

}

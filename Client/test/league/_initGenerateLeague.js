// Season INIT

// build a dataRepository with the leagues
generateLeague_buildDataRepository = function() {
    return [new FifaLeagueClient.Module.League.LeagueViewModel(
        {
          Name: 'Ligue 1',
          TeamPlayers: [
            {
              player: {
                Id: 1,
                Name: "Tony"
              },
              team: {
                Id: 1,
                Name: "Team 1"
              }
            },
            {
              player: {
                Id: 2,
                Name: "Jack"
              },
              team: {
                Id: 2,
                Name: "Team 2"
              }
            }
          ]
        }),
        new FifaLeagueClient.Module.League.LeagueViewModel(
            {
              Name: 'Ligue 2',
              TeamPlayers: [
                {
                  player: {
                    Id: 3,
                    Name: "Jony"
                  },
                  team: {
                    Id: 3,
                    Name: "Team 1"
                  }
                },
                {
                  player: {
                    Id: 4,
                    Name: "Bobby"
                  },
                  team: {
                    Id: 4,
                    Name: "Team 2"
                  }
                }
              ]
            })
    ];
}

// mocking the backend
generateLeague_mockHTTPBackend = function(config, $httpBackend, $q, dataRepository){


  $httpBackend.whenGET(/\/api\/GenerateLeague\?numberOfPlayers=[1-9][0-9]*/)
      .respond(function (method, url, data, headers) {

          var league = new FifaLeagueClient.Module.League.LeagueModel();
          return [200,[league,league]];
      });

  $httpBackend.whenPOST(config.backend+"api/GenerateLeague/")
      .respond(function (method, url, data, headers) {
          // Parsing the data to fack the generation and return what we intended
          var jsonObj = JSON.parse(data);
          var playerLeagues = jsonObj.PlayerLeagues;

          for(var i = 0;i<playerLeagues.length;i++){

            var playerLeague = playerLeagues[i];

            for(var j = 0;j<playerLeague.players.length;j++){

              var player = playerLeague.players[j];

              var createdLeague = new FifaLeagueClient.Module.League.LeagueViewModel(
                {
                  Name: playerLeague.league.Name,
                  TeamPlayers: [
                    {
                      player,
                      team: {
                        Id: 4,
                        Name: "Team 3"
                      }
                    }
                  ]
                });
                dataRepository.push(createdLeague);

            }
          }


          return [200,createdLeague];
      });
}


// mocking the backend in error case
generateLeague_mockHTTPBackend_Error = function(config, $httpBackend, $q, dataRepository){

  $httpBackend.whenGET(/\/api\/GenerateLeague\?numberOfPlayers=[0-9][0-9]*/)
      .respond(500,{Message: 'A league already exists'});

    $httpBackend.whenPOST(config.backend+"api/GenerateLeague/")
        .respond(500,{Message: 'A league already exists'});


}

// Season INIT

// build a dataRepository with the players
player_buildDataRepository = function() {
    return [new FifaLeagueClient.Module.Player.PlayerModel(
            {
              Id: 1,
              Name: "Tony",
              Archived: false
            }),
            new FifaLeagueClient.Module.Player.PlayerModel(
            {
              Id: 2,
              Name: "Jack",
              Archived: false
            }),
            new FifaLeagueClient.Module.Player.PlayerModel(
            {
              Id: 3,
              Name: "Roger",
              Archived: true
            })
        ];
}

// mocking the backend
player_mockHTTPBackend = function(config, $httpBackend, $q, dataRepository){

  $httpBackend.whenGET(config.backend+"api/Player/")
      .respond(function (method, url, data, headers) {
          return [200,dataRepository];
      });

  $httpBackend.whenGET(config.backend+"api/Player?Archived=false")
    .respond(function (method, url, data, headers) {
            var playersToReturn = [];
            for(var i=0; i<dataRepository.length;i++)
            {
                var player = dataRepository[i];
                if (player.Archived == false) {
                    playersToReturn.push(player);
                }
            }
            return [200,playersToReturn];
    });

  $httpBackend.whenGET(config.backend+"api/Player/2")
      .respond(function (method, url, data, headers) {

          var splitedURL = url.split("/");
          var IdToGet = parseInt(splitedURL[splitedURL.length -1]);
          var playerToReturn = null;
          for(var i=0; i<dataRepository.length;i++)
          {
              var player = dataRepository[i];
              if (player.Id == IdToGet) {
                  playerToReturn = player;
              }
          }
          return [200,playerToReturn];

      });


  $httpBackend.whenPOST(config.backend+"api/Player/")
      .respond(function (method, url, data, headers) {

          var Id = dataRepository.length + 1;

          // retrieving the name
          var jsonObj = JSON.parse(data);
          var name = jsonObj.Name;

          var item = new FifaLeagueClient.Module.Player.PlayerModel({
              Id: Id,
              Name: name
          });

          dataRepository.push(item);

          return [200,item];
      });


  $httpBackend.whenPUT(config.backend+"api/Player/1")
      .respond(function (method, url, data, headers) {

          var splitedURL = url.split("/");
          var IdToPUT = parseInt(splitedURL[splitedURL.length -1]);

          // retrieving the name
          var jsonObj = JSON.parse(data);
          var name = jsonObj.Name;

          var item = new FifaLeagueClient.Module.Player.PlayerModel({
              Id: IdToPUT,
              Name: name
          });

          for(var i=0; i<dataRepository.length;i++)
          {
              var player = dataRepository[i];
              if (player.Id == IdToPUT) {
                  dataRepository[i] = item;
              }
          }
          return [200,item];
      });

  $httpBackend.whenDELETE(config.backend+"api/Player/2")
      .respond(function (method, url, data, headers) {

          var splitedURL = url.split("/");
          var IdToDELETE = parseInt(splitedURL[splitedURL.length -1]);

          var dataBck = [];
          for(var i=0; i<dataRepository.length;i++)
          {
              var player = dataRepository[i];
              if (player.Id != IdToDELETE) {
                  dataBck.push(player);
              }
          }
          dataRepository = dataBck;

          return [200,true];
      });
}


// mocking the backend in error case
player_mockHTTPBackend_Error = function(config, $httpBackend, $q, dataRepository){

  $httpBackend.whenGET(config.backend+"api/Player/")
      .respond(0,{status:0});    

  $httpBackend.whenGET(config.backend+"api/Player?Archived=false")
    .respond(0,{status:0});

  $httpBackend.whenGET(config.backend+"api/Player/2")
      .respond(404,{Message: 'Not Found'});

  $httpBackend.whenPOST(config.backend+"api/Player/")
      .respond(400,{Message: 'The player name already exists'});


  $httpBackend.whenPUT(config.backend+"api/Player/1")
      .respond(400,{Message: 'The player name already exists'});

  $httpBackend.whenDELETE(config.backend+"api/Player/2")
      .respond(404,{Message: 'Not Found'});

}

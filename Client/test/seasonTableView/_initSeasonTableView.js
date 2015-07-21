// Season INIT

// build a dataRepository with the seasons
seasonTableView_buildDataRepository = function() {
    return [new FifaLeagueClient.Module.SeasonTableView.SeasonTableViewModel(
        {
            Id: 1,
            Name: 'Season 1'
        }),
        new FifaLeagueClient.Module.SeasonTableView.SeasonTableViewModel(
        {
            Id: 2,
            Name: 'Season 2'
        }),
        new FifaLeagueClient.Module.SeasonTableView.SeasonTableViewModel(
        {
            Id: 3,
            Name: 'German season 1'
        })
    ];
}

// mocking the backend
seasonTableView_mockHTTPBackend = function(config, $httpBackend, $q, dataRepository){

    var mockedSeasonTableViewGetList = $httpBackend.whenGET(config.backend+"api/SeasonTableView/")
        .respond(function (method, url, data, headers) {
            return [200,dataRepository];
        });

    return mockedSeasonTableViewGetList;

}


// mocking the backend in error case
seasonTableView_mockHTTPBackend_Error = function(config, $httpBackend, $q, dataRepository){

    $httpBackend.whenGET(config.backend+"api/SeasonTableView/")
        .respond(0,{status:0});

}

// Helper for creating a team model to use for adding
function createTeamModel() {
    var teamModel = new FifaLeagueClient.Module.Team.TeamModel(null);
    teamModel.Name = "Dundee United";
    teamModel.CountryId = 1;
    teamModel.Country = new FifaLeagueClient.Module.Country.CountryModel ({
        Name: 'Scotland',
        Id: 1
    });
    return teamModel;
}

//Helper for creating a server error
function createErrors() {
    return { 
            'Item.Global' : "The server is unreachable"
    };
}

//Helepr for creating a filter
function createFilter() {
    var filter = new FifaLeagueClient.Module.Team.TeamFilter();
    filter.Id = 3;
    filter.CountryId = 1;
}

//Helepr for creating a list of teams
function createTeamList() {
    return [
        createTeamModel(),
        new FifaLeagueClient.Module.Team.TeamModel({
            Id : 2,
            Name: 'Celtic',
            CountryId : 1,
            Country: {
                Name: 'Scotland',
                Id: 1
            }
        }),
        new FifaLeagueClient.Module.Team.TeamModel({
            Id : 3,
            Name: 'Chelsea',
            CountryId : 2,
            Country: {
                Name: 'England',
                Id: 2
            }
        })
    ];
}
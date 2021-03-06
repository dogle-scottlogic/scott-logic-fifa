module FifaLeagueClient.Module.League {


    export class PlayerAssignLeagueModel {

        public league: LeagueModel;
        public players: Player.PlayerModel[];

        // build the model directly from the data returned by the service
        constructor(_league: LeagueModel, _players: Player.PlayerModel[]){
            this.league = _league;
            this.players = _players;
        }

    }

    export class GenerateLeagueDTOModel extends Common.Services.AbstractFilter {

        public CountryId:number;
        public Rules:FifaLeagueClient.Module.Rules.RulesSetModel;
        public SeasonName:string;
        public PlayerLeagues:PlayerAssignLeagueModel[];

        // build the model directly from the data returned by the service
        constructor(data){
            super();
            if(data != null){
                this.CountryId = data.CountryId;
                this.Rules = data.Rules;
                this.SeasonName = data.SeasonName;
                this.PlayerLeagues = data.PlayerLeagues;
            }
        }

        // Add the request with the names
        public getParameters(query:string):string{
           this.query = query;

           this.addRequestNumberParameter("CountryId", this.CountryId)
              .addRequestParameter("RulesId", this.Rules.Id)
              .addRequestParameter("SeasonName", this.SeasonName);

            return this.query;
        }
    }

}

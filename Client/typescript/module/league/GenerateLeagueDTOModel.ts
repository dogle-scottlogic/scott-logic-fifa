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

    export class GenerateLeagueDTOModel {

        public SeasonId:number;
        public PlayerLeagues:PlayerAssignLeagueModel[];

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.SeasonId = data.SeasonId;
                this.PlayerLeagues = data.PlayerLeagues;
            }
        }
    }

}

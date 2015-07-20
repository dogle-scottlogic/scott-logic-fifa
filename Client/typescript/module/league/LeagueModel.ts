module FifaLeagueClient.Module.League {

    /** VIEW MODEL **/
    export class TeamPlayerViewModel
    {
        public player:Player.PlayerModel;
        public team:Team.TeamModel;

        constructor(data){
            if(data != null){
                this.player = data.player;
                this.team = data.team;
            }
        }
    }

    // Class showing a league with all the players and the teams
    export class LeagueViewModel
    {
         public Id:number;
         public Name:string;
         public TeamPlayers:TeamPlayerViewModel[];

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.Name = data.Name;
                this.TeamPlayers = data.TeamPlayers;
            }
        }
    }

}

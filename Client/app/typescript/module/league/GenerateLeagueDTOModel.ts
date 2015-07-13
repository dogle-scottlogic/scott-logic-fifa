module FifaLeagueClient.Module.League {
    export class GenerateLeagueDTOModel {

        public SeasonId:number;
        public Players:Player.PlayerModel[];

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.SeasonId = data.SeasonId;
                this.Players = data.Players;
            }
        }
    }
}

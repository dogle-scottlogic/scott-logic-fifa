module FifaLeagueClient.Module.League {
    export class LeagueModel {

        public Id:number;
        public Name: string;
        public SeasonId:number;

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.Name = data.Name;
                this.SeasonId = data.SeasonId;
            }
        }
    }
}

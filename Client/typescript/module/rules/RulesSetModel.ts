module FifaLeagueClient.Module.Rules {
    export class RulesSetModel {

        public Id: string;
        public Name: string;
        public LegsPlayedPerOpponent: number;
        public NumPromotionPlaces: number;

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.Name = data.Name;
                this.LegsPlayedPerOpponent = data.LegsPlayedPerOpponent;
                this.NumPromotionPlaces = data.NumPromotionPlaces;
            }
        }
    }
}

module FifaLeagueClient.Module.Season {
    export class SeasonModel {

        public Id:number;
        public CountryId:number;
        public Name: string;

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.CountryId = data.CountryId;
                this.Name = data.Name;
            }
        }
    }
}

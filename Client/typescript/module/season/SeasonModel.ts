module FifaLeagueClient.Module.Season {
    export class SeasonModel {

        public Id:number;
        public CountryId:number;
        public Name: string;
        public SeasonCountry: Country.CountryModel;

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.CountryId = data.CountryId;
                this.Name = data.Name;
                this.SeasonCountry = data.SeasonCountry;
            }
        }
    }
}

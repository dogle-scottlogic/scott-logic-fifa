module FifaLeagueClient.Module.Season {

    // Class showing a season with all the leagues
    export class SeasonViewModel
    {
         public Id:number;
         public Name:string;
         public LeagueViewModels:League.LeagueViewModel[];

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.Name = data.Name;
                this.LeagueViewModels = data.LeagueViewModels;
            }
        }
    }

}

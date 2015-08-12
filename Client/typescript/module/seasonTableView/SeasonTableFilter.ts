module FifaLeagueClient.Module.SeasonTableView {

    export class SeasonTableFilter extends Common.Services.AbstractFilter {

        public Id:number;
        public CountryId:number;
        public SeasonId:number;
        public LeagueId:number;
        public Archived:boolean;

        public HasRemainingMatchToPlay:boolean;

        // build the model directly from the data returned by the service
        constructor(){
          super();
        }

        public reset(){
            this.Id = null;
            this.CountryId = null;
            this.SeasonId = null;
            this.LeagueId = null;
            this.HasRemainingMatchToPlay = null;
            this.Archived = null;
        }

        // Add the request with the names
        public getParameters(query:string):string{
           this.query = query;

           this.addRequestNumberParameter("Id", this.Id)
              .addRequestNumberParameter("CountryId", this.CountryId)
              .addRequestNumberParameter("SeasonId", this.SeasonId)
              .addRequestNumberParameter("LeagueId", this.LeagueId)
              .addRequestBooleanParameter("HasRemainingMatchToPlay", this.HasRemainingMatchToPlay)
              .addRequestBooleanParameter("Archived", this.Archived);

            return this.query;
        }

    }
}

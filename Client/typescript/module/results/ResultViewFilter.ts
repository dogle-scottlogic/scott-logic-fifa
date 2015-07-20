/// <reference path="../common/services/AbstractFilter.ts" />

module FifaLeagueClient.Module.Results {

    export class ResultViewFilter extends Common.Services.AbstractFilter {

        public Date:string;
        public LeagueId:string;
        public SeasonId:string;
        public CountryId:string;
        public PlayedMatch:boolean;

        // build the model directly from the data returned by the service
        constructor(){
          super();
        }

        public reset(){
            this.Date = null;
            this.LeagueId = null;
            this.SeasonId = null;
            this.CountryId = null;
            this.PlayedMatch = null;
        }

        // Add the request with the names
        public getParameters(query:string):string{
           this.query = query;

           this.addRequestParameter("Date", this.Date)
              .addRequestParameter("LeagueId", this.LeagueId)
              .addRequestParameter("SeasonId", this.SeasonId)
              .addRequestParameter("CountryId", this.CountryId)
              .addRequestBooleanParameter("PlayedMatch", this.PlayedMatch);

            return this.query;
        }

    }
}

/// <reference path="../common/services/AbstractFilter.ts" />

module FifaLeagueClient.Module.Results {

    export class ResultViewFilter extends Common.Services.AbstractFilter {

        public Date:Date;
        public LeagueId:string;
        public SeasonId:string;
        public CountryId:string;
        public PlayedMatch:boolean;
        public DateTo:Date;
        public DateFrom:Date;

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
            this.DateTo = null;
            this.DateFrom = null;
        }

        // Add the request with the names
        public getParameters(query:string):string{
           this.query = query;

           this.addRequestDayDateParameter("Date", this.Date)
              .addRequestParameter("LeagueId", this.LeagueId)
              .addRequestParameter("SeasonId", this.SeasonId)
              .addRequestParameter("CountryId", this.CountryId)
              .addRequestBooleanParameter("PlayedMatch", this.PlayedMatch)
              .addRequestDayDateParameter("DateTo", this.DateTo)
              .addRequestDayDateParameter("DateFrom", this.DateFrom);

            return this.query;
        }

    }
}

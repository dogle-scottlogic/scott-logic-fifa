/// <reference path="../common/services/AbstractFilter.ts" />

module FifaLeagueClient.Module.Results {

    export class ResultViewFilter extends Common.Services.AbstractFilter {

        public Date:Date;
        public LeagueId:string;
        public SeasonId:string;
        public CountryId:string;
        public TeamPlayerId:string;
        public PlayedMatch:boolean;
        public DateTo:Date;
        public DateFrom:Date;
        public LimitResult:number;
        public HourOffset:number;

        // build the model directly from the data returned by the service
        constructor(){
          super();
          // We retrieve the client side time offset
          var x = new Date();
          this.HourOffset = -x.getTimezoneOffset() / 60;
        }

        public reset(){
            this.Date = null;
            this.LeagueId = null;
            this.SeasonId = null;
            this.CountryId = null;
            this.TeamPlayerId = null;
            this.PlayedMatch = null;
            this.DateTo = null;
            this.DateFrom = null;
            this.LimitResult = null;
        }

        // Add the request with the names
        public getParameters(query:string):string{
           this.query = query;

           this.addRequestDayDateParameter("Date", this.Date)
              .addRequestParameter("LeagueId", this.LeagueId)
              .addRequestParameter("SeasonId", this.SeasonId)
              .addRequestParameter("CountryId", this.CountryId)
              .addRequestParameter("TeamPlayerId", this.TeamPlayerId)
              .addRequestBooleanParameter("PlayedMatch", this.PlayedMatch)
              .addRequestDayDateParameter("DateTo", this.DateTo)
              .addRequestDayDateParameter("DateFrom", this.DateFrom)
              .addRequestNumberParameter("LimitResult", this.LimitResult)
              .addRequestNumberParameter("HourOffset", this.HourOffset);

            return this.query;
        }

    }
}

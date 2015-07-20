/// <reference path="../common/services/AbstractFilter.ts" />

module FifaLeagueClient.Module.League {

    export class LeagueFilter extends Common.Services.AbstractFilter {

        public Id:number;
        public Name:string;
        public CountryId:number;
        public SeasonId:number;

        // build the model directly from the data returned by the service
        constructor(){
          super();
        }

        public reset(){
            this.Id = null;
            this.Name = null;
            this.CountryId = null;
            this.SeasonId = null;
        }

        // Add the request with the names
        public getParameters(query:string):string{
           this.query = query;

           this.addRequestNumberParameter("Id", this.Id)
              .addRequestParameter("Name", this.Name)
              .addRequestNumberParameter("CountryId", this.CountryId)
              .addRequestNumberParameter("SeasonId", this.SeasonId);

            return this.query;
        }

    }
}

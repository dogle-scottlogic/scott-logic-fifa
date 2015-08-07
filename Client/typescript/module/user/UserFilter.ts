/// <reference path="../common/services/AbstractFilter.ts" />

module FifaLeagueClient.Module.User {

    export class UserFilter extends Common.Services.AbstractFilter {

        public Id:number;
        public Name:string;

        // build the model directly from the data returned by the service
        constructor(){
          super();
        }

        public reset(){
            this.Id = null;
            this.Name = null;
        }

        // Add the request with the names
        public getParameters(query:string):string{
           this.query = query;

           this.addRequestNumberParameter("Id", this.Id)
              .addRequestParameter("Name", this.Name);

            return this.query;
        }

    }
}

module FifaLeagueClient.Module.Season {

    export class SeasonFilter extends Common.Services.AbstractFilter {

        public Id:number;
        public Name:string;
        public CountryId:number;

        // build the model directly from the data returned by the service
        constructor(){
          super();
        }

        public reset(){
            this.Id = null;
            this.Name = null;
            this.CountryId = null;
        }

        // Add the request with the names
        public getParameters(query:string):string{

            query = this.addRequestNumberParameter(query, "Id", this.Id);
            query = this.addRequestParameter(query, "Name", this.Name);
            query = this.addRequestNumberParameter(query, "CountryId", this.CountryId);

            return query;
        }

    }
}

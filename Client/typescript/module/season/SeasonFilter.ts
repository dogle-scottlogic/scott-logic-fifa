module FifaLeagueClient.Module.Season {

    export class SeasonFilter extends Common.Services.AbstractFilter {

        public Id:number;
        public Name:string;
        public CountryId:number;
        public HavingLeague:boolean;
        public HasRemainingMatchToPlay:boolean;
        public Archived:boolean;

        // build the model directly from the data returned by the service
        constructor(){
            super();
        }

        public reset(){
            this.Id = null;
            this.Name = null;
            this.CountryId = null;
            this.HavingLeague = null;
            this.HasRemainingMatchToPlay = null;
            this.Archived = null;
        }

        // Add the request with the names
        public getParameters(query:string):string{
            this.query = query;

            this.addRequestNumberParameter("Id", this.Id)
            .addRequestParameter("Name", this.Name)
            .addRequestNumberParameter("CountryId", this.CountryId)
            .addRequestBooleanParameter("HavingLeague", this.HavingLeague)
            .addRequestBooleanParameter("HasRemainingMatchToPlay", this.HasRemainingMatchToPlay)
            .addRequestBooleanParameter("Archived", this.Archived);

            return this.query;
        }

    }
}

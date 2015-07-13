module FifaLeagueClient.Module.Common.Services {

    export class AbstractFilter {

        query:string;

        public addRequestParameter(name:string, value:string):AbstractFilter{
            if(value!=null){
                this.chainQuery();
                this.query = this.query.concat(name).concat("=").concat(value);
            }
            return this;
        }


        public addRequestNumberParameter(name:string, value:number):AbstractFilter{
            if(value!=null){
                this.chainQuery();
                this.query = this.query.concat(name).concat("=").concat(value.toString());
            }
            return this;
        }

        private chainQuery():void{
            if(this.query != ""){
                this.query = this.query.concat("&");
            }
        }

    }
}

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


        public addRequestBooleanParameter(name:string, value:boolean):AbstractFilter{
            if(value!=null){
                this.chainQuery();
                this.query = this.query.concat(name).concat("=").concat(value.toString());
            }
            return this;
        }


        public addRequestDayDateParameter(name:string, value:Date):AbstractFilter{
            if(value!=null){
                this.chainQuery();
                //Formating the date like : 2015-07-21 (no time in this case)
                var input = value.getFullYear().toString()+"-"+(value.getMonth()+1).toString()+"-"+value.getDate().toString();
                this.query = this.query.concat(name).concat("=").concat(input);
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

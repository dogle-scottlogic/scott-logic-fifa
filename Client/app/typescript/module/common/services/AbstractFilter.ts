module FifaLeagueClient.Module.Common.Services {

    export class AbstractFilter {

        protected addRequestParameter(query:string, name:string, value:string):string{
            if(value!=null){
                if(query != ""){
                    query = query.concat("&");
                }
                query = query.concat(name).concat("=").concat(value);
            }
            return query;
        }


        protected addRequestNumberParameter(query:string, name:string, value:number):string{
            if(value!=null){
                if(query != ""){
                    query = query.concat("&");
                }
                query = query.concat(name).concat("=").concat(value.toString());
            }
            return query;
        }

    }
}

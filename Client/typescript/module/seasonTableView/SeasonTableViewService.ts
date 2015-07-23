// Service used to manipulate a SeasonTableView via web API
module FifaLeagueClient.Module.SeasonTableView {

    export class SeasonTableViewService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the seasonTableView API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/SeasonTableView";
            this.apiURLWithSlash = this.apiURL + "/";
        }

        // Get a seasonTableView list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getSeasonTableViewList(): ng.IPromise<SeasonTableViewModel[]> {
            return this.getSeasonTableViewFilteredList(null);
        }

        public getSeasonTableViewFilteredList(seasonTableFilter:SeasonTableFilter): ng.IPromise<SeasonTableViewModel[]> {
            var deferred = this.qService.defer();
            var getParams = "";
            var url;
            if(seasonTableFilter!= null){
                getParams = seasonTableFilter.getParameters(getParams);
                if(getParams!= ""){
                    url = this.apiURL +"?"+ getParams;
                }else{
                  url = this.apiURLWithSlash;
                }
            }else{
              url = this.apiURLWithSlash;
            }

            var self = this;
            this.httpService.get(url)
                .success(function (data:[string], status, headers, config) {
                    var seasonTableViewList =  [];
                    for(var i = 0; i<data.length; i++){
                        seasonTableViewList.push(self.convertDataToSeasonTableView(data[i]));
                    }
                    deferred.resolve(seasonTableViewList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }




        // Method converting the data into a seasonTableView
        protected convertDataToSeasonTableView = (data): SeasonTableViewModel => {
            return new SeasonTableViewModel(data);
        }


    }

    export var seasonTableViewServiceName = 'seasonTableViewService';

    seasonTableViewModule.factory(seasonTableViewServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new SeasonTableViewService($http,config,$q)
    ]);
}

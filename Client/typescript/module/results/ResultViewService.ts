// Service used to manipulate a resultView via web API
module FifaLeagueClient.Module.Results {

    export class ResultViewService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the resultView API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/ResultView";
            this.apiURLWithSlash = this.apiURL + "/";
        }

        // Get a resultView list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getResultViewList(): ng.IPromise<ResultViewModel[]> {
            return this.getResultViewFilteredList(null);
        }

        // Get a filtered results list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getResultViewFilteredList(resultViewFilter:ResultViewFilter): ng.IPromise<ResultViewModel[]> {
            var deferred = this.qService.defer();
            var getParams = "";
            var url;
            if(resultViewFilter!= null){
                getParams = resultViewFilter.getParameters(getParams);
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
                    var resultViewList =  [];
                    for(var i = 0; i<data.length; i++){
                        resultViewList.push(self.convertDataToResultView(data[i]));
                    }
                    deferred.resolve(resultViewList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }

        // Get a match result view
        public getMatchResultView(Id:number): ng.IPromise<MatchResultViewModel> {
            var deferred = this.qService.defer();

            var self = this;
            this.httpService.get(this.apiURLWithSlash+Id)
                .success(function (data, status, headers, config) {
                    deferred.resolve(new MatchResultViewModel(data));
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }


        // Method converting the data into a resultView
        protected convertDataToResultView = (data): ResultViewModel => {
            return new ResultViewModel(data);
        }


    }

    export var resultViewServiceName = 'resultViewService';

    resultsModule.factory(resultViewServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new ResultViewService($http,config,$q)
    ]);
}

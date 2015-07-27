// Service used to manipulate a match via web API
module FifaLeagueClient.Module.Results {

    export class MatchService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the match API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/Match";
            this.apiURLWithSlash = this.apiURL+"/";
        }

        // Get a match list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getMatchList(): ng.IPromise<MatchModel[]> {
            return this.getMatchFilteredList(null);
        }

        // Get a filtered match list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getMatchFilteredList(matchFilter:MatchFilter): ng.IPromise<MatchModel[]> {
            var deferred = this.qService.defer();
            var getParams = "";
            var url;
            if(matchFilter!= null){
                getParams = matchFilter.getParameters(getParams);
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
                    var matchList =  [];
                    for(var i = 0; i<data.length; i++){
                        matchList.push(self.convertDataToMatch(data[i]));
                    }
                    deferred.resolve(matchList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }

        // Get the detail of a match by its ID
        public getMatch(ID): ng.IPromise<MatchModel>{
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.get(this.apiURLWithSlash + ID).success(function (data, status, headers, config) {
                var match = self.convertDataToMatch(data);
                deferred.resolve(match);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a match in the database
        public addMatch(match:MatchModel): ng.IPromise<MatchModel>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURLWithSlash, match).success(function (data, status, headers, config) {
                var match = self.convertDataToMatch(data);
                deferred.resolve(match);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating a match with the match informations
        public updateMatch(match:MatchModel): ng.IPromise<MatchModel> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.put(this.apiURLWithSlash + match.Id, match).success(function (data, status, headers, config) {
                var match = self.convertDataToMatch(data);
                deferred.resolve(match);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a match by is ID
        public deleteMatch(Id) : ng.IPromise<boolean> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.delete(this.apiURLWithSlash + Id).success(function (data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into a match
        protected convertDataToMatch = (data): MatchModel => {
            return new MatchModel(data);
        }

    }

    export var matchServiceName = 'matchService';

    resultsModule.factory(matchServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new MatchService($http,config,$q)
    ]);
}

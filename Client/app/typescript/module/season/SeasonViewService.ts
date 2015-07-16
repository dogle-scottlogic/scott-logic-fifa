// Service used to manipulate a season via web API
module FifaLeagueClient.Module.Season {

    export class SeasonViewService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the season API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/SeasonView";
            this.apiURLWithSlash = this.apiURL+"/";
        }

        // Get the view detail of a season by its ID
        public getSeasonView(ID): ng.IPromise<SeasonViewModel>{
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.get(this.apiURLWithSlash + ID).success(function (data, status, headers, config) {
                var season = self.convertDataToSeasonView(data);
                deferred.resolve(season);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into a season
        protected convertDataToSeasonView = (data): SeasonViewModel => {
            return new SeasonViewModel(data);
        }

    }

    export var seasonViewServiceName = 'seasonViewService';

    seasonModule.factory(seasonViewServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new SeasonViewService($http,config,$q)
    ]);
}

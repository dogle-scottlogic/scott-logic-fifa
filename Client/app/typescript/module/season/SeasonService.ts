// Service used to manipulate a season via web API
module FifaLeagueClient.Module.Season {

    export class SeasonService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the season API
        apiURL:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/Season/";
        }

        // Get a season list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getSeasonList(): ng.IPromise<SeasonModel[]> {
            var deferred = this.qService.defer();

            var self = this;
            this.httpService.get(this.apiURL)
                .success(function (data:[string], status, headers, config) {
                    var seasonList =  [];
                    for(var i = 0; i<data.length; i++){
                        seasonList.push(self.convertDataToSeason(data[i]));
                    }
                    deferred.resolve(seasonList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }

        // Get the detail of a season by its ID
        public getSeason(ID): ng.IPromise<SeasonModel>{
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.get(this.apiURL + ID).success(function (data, status, headers, config) {
                var season = self.convertDataToSeason(data);
                deferred.resolve(season);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a season in the database
        public addSeason(season:SeasonModel): ng.IPromise<SeasonModel>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURL, season).success(function (data, status, headers, config) {
                var season = self.convertDataToSeason(data);
                deferred.resolve(season);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating a season with the season informations
        public updateSeason(season:SeasonModel): ng.IPromise<SeasonModel> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.put(this.apiURL + season.Id, season).success(function (data, status, headers, config) {
                var season = self.convertDataToSeason(data);
                deferred.resolve(season);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a season by is ID
        public deleteSeason(Id) : ng.IPromise<boolean> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.delete(this.apiURL + Id).success(function (data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into a season
        protected convertDataToSeason = (data): SeasonModel => {
            return new SeasonModel(data);
        }

    }

    export var seasonServiceName = 'seasonService';

    seasonModule.factory(seasonServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new SeasonService($http,config,$q)
    ]);
}

// Service used to manipulate a league via web API
module FifaLeagueClient.Module.League {

    export class LeagueService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the league API
        apiURL:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/League/";
        }

        // Get a league list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getLeagueList(): ng.IPromise<LeagueModel[]> {
            var deferred = this.qService.defer();

            var self = this;
            this.httpService.get(this.apiURL)
                .success(function (data:[string], status, headers, config) {
                    var leagueList =  [];
                    for(var i = 0; i<data.length; i++){
                        leagueList.push(self.convertDataToLeague(data[i]));
                    }
                    deferred.resolve(leagueList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }

        // Get the detail of a league by its ID
        public getLeague(ID): ng.IPromise<LeagueModel>{
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.get(this.apiURL + ID).success(function (data, status, headers, config) {
                var league = self.convertDataToLeague(data);
                deferred.resolve(league);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a league in the database
        public addLeague(league:LeagueModel): ng.IPromise<LeagueModel>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURL, league).success(function (data, status, headers, config) {
                var league = self.convertDataToLeague(data);
                deferred.resolve(league);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating a league with the league informations
        public updateLeague(league:LeagueModel): ng.IPromise<LeagueModel> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.put(this.apiURL + league.Id, league).success(function (data, status, headers, config) {
                var league = self.convertDataToLeague(data);
                deferred.resolve(league);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a league by is ID
        public deleteLeague(Id) : ng.IPromise<boolean> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.delete(this.apiURL + Id).success(function (data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into a league
        protected convertDataToLeague = (data): LeagueModel => {
            return new LeagueModel(data);
        }

    }

    export var leagueServiceName = 'leagueService';

    leagueModule.factory(leagueServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new LeagueService($http,config,$q)
    ]);
}

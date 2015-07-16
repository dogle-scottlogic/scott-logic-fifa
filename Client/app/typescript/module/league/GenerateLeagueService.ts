// Service used to manipulate a league via web API
module FifaLeagueClient.Module.League {

    export class GenerateLeagueService {
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
            this.apiURL = config.backend+"api/GenerateLeague/";
        }

        // generate a league in the database
        public generateLeague(generateLeague:GenerateLeagueDTOModel): ng.IPromise<number>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURL, generateLeague).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

    }

    export var generateLeagueServiceName = 'generateLeagueService';

    leagueModule.factory(generateLeagueServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new GenerateLeagueService($http,config,$q)
    ]);
}

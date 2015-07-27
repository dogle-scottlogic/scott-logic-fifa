// Service used to manipulate a league via web API
module FifaLeagueClient.Module.League {

    export class GenerateLeagueService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the league API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/GenerateLeague";
            this.apiURLWithSlash = this.apiURL + "/";
        }

        // generate a league in the database
        public generateLeague(generateLeague:GenerateLeagueDTOModel): ng.IPromise<number>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURLWithSlash, generateLeague).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }


        // Define the number of leagues (it depend on the number of players)
        public getLeaguesFilteredList(numberOfPlayer:number, generateLeague:GenerateLeagueDTOModel): ng.IPromise<LeagueModel[]>{
            var deferred = this.qService.defer();
            var self = this;
            var params = "?numberOfPlayers="+numberOfPlayer;
            var getParams = generateLeague.getParameters(params);

            this.httpService.get(this.apiURL+getParams).success(function (data, status, headers, config) {
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

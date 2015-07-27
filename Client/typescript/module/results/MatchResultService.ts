module FifaLeagueClient.Module.Results {
	export class MatchResultsService {
		httpService: ng.IHttpService;
        qService: ng.IQService;
        apiURL:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/MatchResult/";
        }

        public addResult(result: MatchResultDTO): ng.IPromise<boolean> {
        	var deferred = this.qService.defer();
        	var self = this;

            this.httpService.post(this.apiURL, result).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }
	}

	export var serviceName = 'matchResultsService';

    resultsModule.factory(serviceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new MatchResultsService($http,config,$q)
    ]);
}

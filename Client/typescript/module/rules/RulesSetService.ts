// Service used to retrieve the various rules sets
module FifaLeagueClient.Module.Rules {

    export class RulesSetService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the country API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/RuleSet";
            this.apiURLWithSlash = this.apiURL+"/";
        }

        // Get a rules set list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getRulesSetList(): ng.IPromise<RulesSetModel[]> {
            var deferred = this.qService.defer();
            var getParams = "";

            var self = this;
            this.httpService.get(this.apiURLWithSlash)
                .success(function (data:[string], status, headers, config) {
                    var rulesSetList =  [];
                    for(var i = 0; i<data.length; i++){
                        rulesSetList.push(self.convertDataToRulesSet(data[i]));
                    }
                    deferred.resolve(rulesSetList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }

        // Method converting the data into a rules set
        protected convertDataToRulesSet = (data): RulesSetModel => {
            return new RulesSetModel(data);
        }

    }

    export var rulesSetServiceName = 'rulesSetService';

    rulesModule.factory(rulesSetServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new RulesSetService($http,config,$q)
    ]);
}

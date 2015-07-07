// Service used to manipulate a player via web API
module FifaLeagueClient.Module.Player {

    export class PlayerService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the player API
        apiURL:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/Player/";
        }

        // Get a player list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getPlayerList(): ng.IPromise<PlayerModel[]> {
            var deferred = this.qService.defer();

            var self = this;
            this.httpService.get(this.apiURL)
                .success(function (data:[string], status, headers, config) {
                    var playerList =  [];
                    for(var i = 0; i<data.length; i++){
                        playerList.push(self.convertDataToPlayer(data[i]));
                    }
                    deferred.resolve(playerList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }

        // Get the detail of a player by its ID
        public getPlayer(ID): ng.IPromise<PlayerModel>{
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.get(this.apiURL + ID).success(function (data, status, headers, config) {
                var player = self.convertDataToPlayer(data);
                deferred.resolve(player);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a player in the database
        public addPlayer(player:PlayerModel): ng.IPromise<PlayerModel>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURL, player).success(function (data, status, headers, config) {
                var player = self.convertDataToPlayer(data);
                deferred.resolve(player);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating a player with the player information
        public updatePlayer(player:PlayerModel): ng.IPromise<PlayerModel> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.put(this.apiURL + player.Id, player).success(function (data, status, headers, config) {
                var player = self.convertDataToPlayer(data);
                deferred.resolve(player);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a player by is ID
        public deletePlayer(Id) : ng.IPromise<boolean> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.delete(this.apiURL + Id).success(function (data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into a player
        protected convertDataToPlayer = (data): PlayerModel => {
            return new PlayerModel(data);
        }

    }

    export var playerServiceName = 'playerService';

    playerModule.factory(playerServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new PlayerService($http,config,$q)
    ]);
}

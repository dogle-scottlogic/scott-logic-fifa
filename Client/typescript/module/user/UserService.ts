/// <reference path="../common/services/AbstractService.ts"/>

// Service used to manipulate an user via web API
module FifaLeagueClient.Module.User {

    export class UserService extends Common.Services.AbstractService<UserModel, string> {

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            super($http, config, $q, "api/User");
        }
        // Method converting the data into a user
        protected convertDataToTObject(data): UserModel {
            return new UserModel(data);
        }

    }

    export var userServiceName = 'userService';

    userModule.factory(userServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
    new UserService($http,config,$q)
]);
}

/// <reference path="../common/services/AbstractService.ts"/>

// Service used to manipulate a season via web API
module FifaLeagueClient.Module.Season {

    export class SeasonService extends Common.Services.AbstractService<SeasonModel, number> {

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            super($http, config, $q, "api/Season");
        }

        // Get a season list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getSeasonList(): ng.IPromise<SeasonModel[]> {
            return super.getList();
        }

        // Get a filtered season list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getSeasonFilteredList(seasonFilter:SeasonFilter): ng.IPromise<SeasonModel[]> {
            return super.getFilteredList(seasonFilter);
        }

        // Get the detail of a season by its ID
        public getSeason(Id:number): ng.IPromise<SeasonModel>{
            return super.get(Id);
        }

        // add a season in the database
        public addSeason(season:SeasonModel): ng.IPromise<SeasonModel>{
            return super.add(season);
        }

        // Updating a season with the season informations
        public updateSeason(season:SeasonModel): ng.IPromise<SeasonModel> {
            return super.update(season.Id, season);
        }

        // Deleting a season by is ID
        public deleteSeason(Id:number) : ng.IPromise<boolean> {
            return super.delete(Id);
        }

        // Method converting the data into a season
        protected convertDataToTObject(data): SeasonModel {
            return new SeasonModel(data);
        }

    }

    export var seasonServiceName = 'seasonService';

    seasonModule.factory(seasonServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
    new SeasonService($http,config,$q)
]);
}

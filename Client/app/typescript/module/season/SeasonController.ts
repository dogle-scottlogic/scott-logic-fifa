/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Season {
    export class SeasonController extends Common.Controllers.AbstractController {

        scope;
        seasons:SeasonModel[];
        season: SeasonModel;
        mainService : SeasonService;
        showCreateForm : boolean;
        showEditForm : boolean;
        showListForm : boolean;

        static $inject = ["$scope", 'seasonService'];

        constructor(scope, seasonService : SeasonService){
            super(scope);
            this.mainService = seasonService;

            this.seasons = [];
            this.season = new SeasonModel(null);
            this.showCreateForm = false;
            this.showEditForm = false;
            this.showListForm = true;
        }

        // Method showing the create form
        public showCreateSeason(){
            this.showCreateForm = true;
            this.showEditForm = false;
            this.showListForm = false;
            this.season = new SeasonModel(null);
        }

        // Method showing the edit form
        public showEditSeason(Id:number){
            this.showCreateForm = false;
            this.showEditForm = true;
            this.showListForm = false;
            this.loadSeason(Id);
        }

        // Method showing the list of seasons
        public showList(){
            this.showCreateForm = false;
            this.showEditForm = false;
            this.showListForm = true;
            this.fillSeasons();
        }

        /** LOADING THE SEASON **/
        // loading the season from database
        public loadSeason = (id) => {
            this.resetErrors();
            if(id != null){
                this.mainService.getSeason(id)
                    .then(this.handleLoadSuccess)
                    .catch(this.handleLoadErrors);
            }
        }

        // Do nothing if the creation is successfull
        protected handleLoadSuccess = (data:SeasonModel) => {
            this.season = data;
        }

        // Method adding loading errors in errors list
        protected handleLoadErrors = (config) => {
            this.errors = config.errors;
        }

        /** CREATING THE SEASON **/
        // Method adding a season in the database
        public addSeason = ()  => {
            this.resetErrors();
            // try to create the season
            // refresh the list if it is a success
            // show the errors if not
            this.mainService.addSeason(this.season)
                .then(this.handleCreatingSuccess)
                .catch(this.handleCreatingErrors);
        }

        // Do nothing if the creation is successfull
        protected handleCreatingSuccess = (data:SeasonModel) => {
            this.showList();
        }

        // Method adding creating errors in creatingErrors list
        protected handleCreatingErrors = (config) => {
            this.errors = config.errors;
        }

        /** UPDATING THE SEASON **/
        // Method adding a season in the database
        public updateSeason = ()  => {
            // reset the errors created before
            this.resetErrors();
            // try to create the season
            // refresh the list if it is a success
            // show the errors if not
            this.mainService.updateSeason(this.season)
                .then(this.handleUpdateSuccess)
                .catch(this.handleUpdateErrors);
        }

        // Do nothing if the creation is successfull
        protected handleUpdateSuccess = (data:SeasonModel) => {
            this.showList();
        }

        // Method adding creating errors in creatingErrors list
        protected handleUpdateErrors = (config) => {
            this.errors = config.errors;
        }

        /** DELETING THE SEASON **/
        // Method adding a season in the database


        // Method deleting a Country
        public deleteSeasonInstance(Id:number){
            this.deleteSeason(Id);
        }

        public deleteSeason = (Id:number)  => {
            // reset the errors created before
            this.resetErrors();
            // try to delete the season
            // refresh the list if it is a success
            // show the errors if not
            this.mainService.deleteSeason(Id)
                .then(this.handleDeleteSuccess)
                .catch(this.handleDeleteErrors);
        }

        // Do nothing if the creation is successfull
        protected handleDeleteSuccess = (response:boolean) => {
            this.showList();
        }

        // Method adding creating errors in creatingErrors list
        protected handleDeleteErrors = (config) => {
            this.errors = config.errors;
        }

        // call the service in order to get the list of seasons
        public fillSeasons = () => {
            this.errors = {};
            this.mainService.getSeasonList()
                .then(this.fillSeasonsSuccessCallBack)
                .catch(this.fillSeasonsErrorCallBack);
        }

        // fill the seasons - if the callback is a success
        protected fillSeasonsSuccessCallBack = (seasons:SeasonModel[]) => {
            this.seasons = seasons;
        }

        protected fillSeasonsErrorCallBack = (config) => {
            this.errors = config.errors;
        }

    }
}

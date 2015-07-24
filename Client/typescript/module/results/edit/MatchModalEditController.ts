/// <reference path="../../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Results {

	export class MatchModalEditController extends Common.Controllers.AbstractController {

		matchResultsService: MatchResultsService;
		resultViewService: ResultViewService;
    modalInstance;

		id: number;
		match: MatchResultViewModel;

		static $inject = ["$scope", 'resultViewService', 'matchResultsService', '$modalInstance', 'id'];


		constructor(scope, resultViewService:ResultViewService, matchResultsService: MatchResultsService, $modalInstance, id) {
			super(scope);
			this.resultViewService = resultViewService;
			this.matchResultsService = matchResultsService;
			this.modalInstance = $modalInstance;
			this.id = id;
			this.loadMatch();
		}

		private loadMatch = () => {
			var self = this;
			if(self.id != null){
				this.loadingPromise =
					this.resultViewService.getMatchResultView(this.id)
						.then(function(data) {
							self.match = data;
						}).catch(this.onError);
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		protected onSaveScoreSuccess = () => {
			this.modalInstance.close();
		}

		public saveResult = () => {
			var result = new MatchResultDTO();
			result.homePlayerId = this.match.homeTeamPlayer.Id;
			result.scoreHome = this.match.homeTeamPlayer.nbGoals;
			result.awayPlayerId = this.match.awayTeamPlayer.Id;
			result.scoreAway = this.match.awayTeamPlayer.nbGoals;
			result.date = this.match.Date;

		this.loadingPromise =
			this.matchResultsService.addResult(result)
				.then(this.onSaveScoreSuccess)
				.catch(this.onError);
		}

    // cancel
    public cancel() {
        this.modalInstance.dismiss('cancel');
    }

	}
}

/// <reference path="../../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Results {

	export class MatchModalEditController extends Common.Controllers.AbstractController {

		matchResultsService: MatchResultsService;
		resultViewService: ResultViewService;
    modalInstance;

		match: MatchResultViewModel;

		static $inject = ["$scope", 'resultViewService', 'matchResultsService', '$modalInstance', 'Id'];


		constructor(scope, resultViewService:ResultViewService, matchResultsService: MatchResultsService, $modalInstance, Id) {
			super(scope);
			this.resultViewService = resultViewService;
			this.matchResultsService = matchResultsService;
			this.modalInstance = $modalInstance;
			this.match = new MatchResultViewModel(null);
			this.match.Id = Id;
			this.loadMatch();
		}

		private loadMatch = () => {
			var self = this;
			if(self.match.Id != null){
				self.loadingPromise =
					self.resultViewService.getMatchResultView(self.match.Id)
						.then(function(data) {
							self.match = data;
						}).catch(self.onError);
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		protected onSaveScoreSuccess = () => {
			this.modalInstance.close();
		}

		public saveResult = () => {
			var self = this;
			var result = new MatchResultDTO();
			result.homePlayerId = self.match.homeTeamPlayer.Id;
			result.scoreHome = self.match.homeTeamPlayer.nbGoals;
			result.awayPlayerId = self.match.awayTeamPlayer.Id;
			result.scoreAway = self.match.awayTeamPlayer.nbGoals;
			result.date = self.match.Date;

		self.loadingPromise =
			self.matchResultsService.addResult(result)
				.then(self.onSaveScoreSuccess)
				.catch(self.onError);
		}

    // cancel
    public cancel() {
        this.modalInstance.dismiss('cancel');
    }

	}
}

module FifaLeagueClient.Module.Results {
	export class TeamPlayerModel {
		public Id: number;
		public TeamId: number;
		public PlayerId: number;
		public DisplayName: string;

		constructor(data){
			if (data != null){
				this.Id = data.Id;
				this.TeamId = data.TeamId;
				this.PlayerId = data.PlayerId;

				this.DisplayName = data.Player.Name + " (" + data.Team.Name + ")";
			}
		}
	}
}
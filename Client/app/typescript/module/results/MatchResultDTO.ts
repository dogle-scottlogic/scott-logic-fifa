module FifaLeagueClient.Module.Results {
	export class MatchResultDTO {
		public homePlayerId: number;
		public awayPlayerId: number;
		public scoreHome: number;
		public scoreAway: number;
		public date: Date;

		contructor(data){
			if (data != null){
				this.homePlayerId = data.homePlayerId;
				this.awayPlayerId = data.awayPlayerId;
				this.scoreHome = data.scoreHome;
				this.scoreAway = data.scoreAway;
				this.date = data.date;
			}
		}
	}
}
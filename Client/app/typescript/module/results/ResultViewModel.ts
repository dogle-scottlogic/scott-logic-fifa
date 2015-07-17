module FifaLeagueClient.Module.Results {

	export class ResultViewModel {

      public Date: Date;
	    public leagues: LeagueResultViewModel[];

			// build the model directly from the data returned by the service
			constructor(data){
					if(data != null){
							this.Date = data.Date;
			        this.leagues = data.leagues;
					}
			}
	}

  export class LeagueResultViewModel {
    public Id: number;
    public Name: string;
		public Date: Date;

		public matches: MatchResultViewModel[];

    contructor(data){
      if (data != null){
        this.Id = data.Id;
        this.Name = data.Name;
				this.Date = data.Date;
				this.matches = data.matches;
      }
    }
  }

	export class MatchResultViewModel {
		public leagueId: number;
		public leagueName: string;
		public Date: Date;

		public homeTeamPlayer: TeamPlayerResultViewModel;
		public awayTeamPlayerName: TeamPlayerResultViewModel;

		contructor(data){
			if (data != null){
				this.leagueId = data.Id;
				this.leagueName = data.Name;
				this.Date = data.Date;
				this.homeTeamPlayer = data.homeTeamPlayer;
				this.awayTeamPlayerName = data.awayTeamPlayerName;
			}
		}
	}

	export class TeamPlayerResultViewModel {
		public Id: number;
		public TeamName: string;
		public PlayerName: string;
		public nbGoals: number;

		contructor(data){
			if (data != null){
				this.Id = data.Id;
				this.TeamName = data.TeamName;
				this.PlayerName = data.PlayerName;
				this.nbGoals = data.nbGoals;
			}
		}
	}


}

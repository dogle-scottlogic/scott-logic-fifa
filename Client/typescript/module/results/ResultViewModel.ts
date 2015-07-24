module FifaLeagueClient.Module.Results {

	export class ResultViewModel {

      public Date: Date;
	    public countryMatches: CountryResultViewModel[];

			// build the model directly from the data returned by the service
			constructor(data){
					if(data != null){
							this.Date = data.Date;
			        this.countryMatches = data.countryMatches;
					}
			}
	}

export class CountryResultViewModel {
	public Id: number;
	public Name: string;
	public Date: Date;

	public seasonMatches: SeasonResultViewModel[];

	contructor(data){
		if (data != null){
			this.Id = data.Id;
			this.Name = data.Name;
			this.Date = data.Date;
			this.seasonMatches = data.seasonMatches;
		}
	}
}

	export class SeasonResultViewModel {
		public Id: number;
		public Name: string;
		public Date: Date;

		public leagueMatches: LeagueResultViewModel[];

		contructor(data){
			if (data != null){
				this.Id = data.Id;
				this.Name = data.Name;
				this.Date = data.Date;
				this.leagueMatches = data.leagueMatches;
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
		public Id:number;
		public leagueId: number;
		public leagueName: string;
		public Date: Date;

		public homeTeamPlayer: TeamPlayerResultViewModel;
		public awayTeamPlayer: TeamPlayerResultViewModel;


		// build the model directly from the data returned by the service
		constructor(data){
				if(data != null){
					this.Id = data.Id;
					this.leagueId = data.leagueId;
					this.leagueName = data.leagueName;
					if(data.Date != null){
						this.Date = new Date(data.Date);
					}
					this.homeTeamPlayer = data.homeTeamPlayer;
					this.awayTeamPlayer = data.awayTeamPlayer;
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

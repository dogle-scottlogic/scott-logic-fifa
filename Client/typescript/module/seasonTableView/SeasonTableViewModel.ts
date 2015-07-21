module FifaLeagueClient.Module.SeasonTableView {


	export class SeasonTableViewModel {

      public Id: number;
			public Name:String;
	    public LeagueTables: LeagueTableViewModel[];

			// build the model directly from the data returned by the service
			constructor(data){
					if(data != null){
							this.Id = data.Id;
			        this.Name = data.Name;
			        this.LeagueTables = data.LeagueTables;
					}
			}
	}

	export class LeagueTableViewModel {

			public Id: number;
			public Name:String;
			public TeamPlayers: TeamPlayerTableLeagueViewModel[];

			// build the model directly from the data returned by the service
			constructor(data){
					if(data != null){
							this.Id = data.Id;
							this.Name = data.Name;
							this.TeamPlayers = data.TeamPlayers;
					}
			}
	}

	export class TeamPlayerTableLeagueViewModel {

			public position: number;
			public nbPlayedMatches: number;
			public nbGoals: number;
			public nbPoints: number;
			public player:Player.PlayerModel;
			public team: Team.TeamModel;

			// build the model directly from the data returned by the service
			constructor(data){
					if(data != null){
							this.position = data.position;
							this.nbPlayedMatches = data.nbPlayedMatches;
							this.nbGoals = data.nbGoals;
							this.nbPoints = data.nbPoints;
							this.player = data.player;
							this.team = data.team;
					}
			}
	}


}

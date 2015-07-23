module FifaLeagueClient.Module.Team {


	export class TeamPlayerStatisticViewModel {

      public Id: number;
			public teamName:String;
			public playerName:String;
			public seasonId:number;
			public seasonName:String;
			public nbAverageGoals:number;

	    public lastPlayedMatch: MatchStatisticViewModel;
	    public nextMatch: MatchStatisticViewModel;

			// build the model directly from the data returned by the service
			constructor(data){
					if(data != null){
							this.Id = data.Id;
			        this.teamName = data.teamName;
			        this.playerName = data.playerName;
			        this.seasonId = data.seasonId;
			        this.seasonName = data.seasonName;
			        this.nbAverageGoals = data.nbAverageGoals;

			        this.lastPlayedMatch = data.lastPlayedMatch;
							this.nextMatch = data.nextMatch;
					}
			}
	}

	export class MatchStatisticViewModel {

			public Id: number;
			public leagueId:number;
			public leagueName:String;
			public homeTeam:String;
			public awayTeam:String;
			public homeNbGoals:number;
			public awayNbGoals:number;
			public dateMatch:Date;


			// build the model directly from the data returned by the service
			constructor(data){
					if(data != null){
							this.Id = data.Id;
							this.leagueId = data.leagueId;
							this.leagueName = data.leagueName;
							this.homeTeam = data.homeTeam;
							this.awayTeam = data.awayTeam;
							this.homeNbGoals = data.homeNbGoals;
							this.awayNbGoals = data.awayNbGoals;
							this.dateMatch = data.dateMatch;
					}
			}
	}




}

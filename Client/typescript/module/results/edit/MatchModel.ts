module FifaLeagueClient.Module.Results {

    export class MatchModel {

        public Id:number;
        public Date: Date;
        public Played: boolean;
        public LeagueId: number;
        public Scores: ScoreModel[];

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.Date = data.Date;
                this.Played = data.Played;
                this.LeagueId = data.LeagueId;
                this.Scores = data.Scores;
            }
        }
    }

    export class ScoreModel {

        public Id:number;
        public MatchId: number;
        public TeamPlayerId: number;
        public Goals: number;
        public Location:Location;

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.MatchId = data.MatchId;
                this.TeamPlayerId = data.TeamPlayerId;
                this.Goals = data.Goals;
                this.Location = data.Location;
            }
        }

    }

    enum Location {
      Home = 1,
      Away = 2
    }

}

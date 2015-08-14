module FifaLeagueClient.Module.SeasonTableView {


    export class SeasonTableViewModel {

    public Id: number;
    public Name:String;
    public RuleSet:FifaLeagueClient.Module.Rules.RulesSetModel;
    public LeagueTables: LeagueTableViewModel[];

    // build the model directly from the data returned by the service
    constructor(data){
        if(data != null){
            this.Id = data.Id;
            this.Name = data.Name;
            this.LeagueTables = data.LeagueTables;
            this.RuleSet = data.RuleSet;
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

            public Id: number;
            public position: number;
            public nbPlayedMatches: number;
            public nbGoalsFor: number;
            public nbGoalsAgainst: number;
            public nbGoalsDiff: number;
            public nbWin: number;
            public nbDraw: number;
            public nbLost: number;
            public nbPoints: number;
            public player:Player.PlayerModel;
            public team: Team.TeamModel;
            public show:boolean;

            // build the model directly from the data returned by the service
            constructor(data){
                    if(data != null){
                            this.position = data.position;
                            this.nbPlayedMatches = data.nbPlayedMatches;
                            this.nbGoalsFor = data.nbGoalsFor;
                            this.nbGoalsAgainst = data.nbGoalsAgainst;
                            this.nbGoalsDiff = data.nbGoalsDiff;
                            this.nbWin = data.nbWin;
                            this.nbDraw = data.nbDraw;
                            this.nbLost = data.nbLost;
                            this.nbPoints = data.nbPoints;
                            this.player = data.player;
                            this.team = data.team;
                            this.show = false;
                    }
            }
    }


}

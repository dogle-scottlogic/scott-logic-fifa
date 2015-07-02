namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MatchesAndScores : DbMigration
    {
        // Creating the new score table
        public override void Up()
        {

            // Creating the new score table
            CreateTable(
                "dbo.Scores",
                c => new
                {
                    Id = c.Int(nullable: false, identity: true),
                    MatchId = c.Int(nullable: false),
                    PlayerId = c.Int(nullable: false),
                    Goals = c.Int(nullable: false),
                    Location = c.Int(nullable: false)
                })
                .PrimaryKey(s => s.Id)
                .ForeignKey("dbo.Matches", s => s.MatchId, cascadeDelete: false)
                .ForeignKey("dbo.Players", s => s.PlayerId, cascadeDelete: false)
                .Index(s => s.MatchId)
                .Index(s => s.PlayerId);

            // Migrating the scores from Match table in Score table -> Home scores
            Sql("insert into dbo.Scores (MatchId, PlayerId, Goals, Location) "
            + " select match.Id, match.HomeTeamId, match.HomeScore, 1 from dbo.Matches as match");
            // Migrating the scores from Match table in Score table -> Away scores
            Sql("insert into dbo.Scores (MatchId, PlayerId, Goals, Location) "
            + " select match.Id, match.AwayTeamId, match.AwayScore, 2 from dbo.Matches as match ");

            DropForeignKey("dbo.Matches", "AwayTeamId", "dbo.Players");
            DropForeignKey("dbo.Matches", "HomeTeamId", "dbo.Players");
            DropIndex("dbo.Matches", new[] { "AwayTeamId" });
            DropIndex("dbo.Matches", new[] { "HomeTeamId" });
            DropColumn("dbo.Matches", "HomeTeamId");
            DropColumn("dbo.Matches", "AwayTeamId");
            DropColumn("dbo.Matches", "HomeScore");
            DropColumn("dbo.Matches", "AwayScore");
            DropColumn("dbo.Matches", "Outcome");
        }

        // Downgrading (Update-Database  –TargetMigration:"TeamsAndCountry")
        public override void Down()
        {
            AddColumn("dbo.Matches", "Outcome", c => c.Int(nullable: false));
            AddColumn("dbo.Matches", "AwayScore", c => c.Int(nullable: false));
            AddColumn("dbo.Matches", "HomeScore", c => c.Int(nullable: false));
            AddColumn("dbo.Matches", "AwayTeamId", c => c.Int(nullable: false));
            AddColumn("dbo.Matches", "HomeTeamId", c => c.Int(nullable: false));
            CreateIndex("dbo.Matches", "HomeTeamId");
            CreateIndex("dbo.Matches", "AwayTeamId");
            AddForeignKey("dbo.Matches", "HomeTeamId", "dbo.Players", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Matches", "AwayTeamId", "dbo.Players", "Id", cascadeDelete: true);

            // Reverting the scores from the Score table to Matches table -> HomeScore
            Sql("UPDATE dbo.Matches SET dbo.Matches.HomeTeamId = score.PlayerId, dbo.Matches.HomeScore = score.Goals" +
                " FROM dbo.Scores as score WHERE dbo.Matches.Id = score.MatchId and score.Location = 1");
            // Reverting the scores from the Score table to Matches table -> AwayScore
            Sql("UPDATE dbo.Matches SET dbo.Matches.AwayTeamId = score.PlayerId, dbo.Matches.AwayScore = score.Goals" +
                " FROM dbo.Scores as score WHERE dbo.Matches.Id = score.MatchId and score.Location = 2");

            // drop the score table
            DropForeignKey("dbo.Scores", "MatchId", "dbo.Matches");
            DropForeignKey("dbo.Scores", "PlayerId", "dbo.Players");
            DropIndex("dbo.Scores", new[] { "MatchId" });
            DropIndex("dbo.Scores", new[] { "PlayerId" });
            DropTable("dbo.Scores");

        }
    }
}

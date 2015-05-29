namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Leagues",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        SeasonId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Seasons", t => t.SeasonId, cascadeDelete: false)
                .Index(t => t.SeasonId);
            
            CreateTable(
                "dbo.Players",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        TeamName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Seasons",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Matches",
                c => new
                    {
                        HomeTeamId = c.Int(nullable: false),
                        AwayTeamId = c.Int(nullable: false),
                        Id = c.Int(nullable: false, identity: true),
                        HomeScore = c.Int(nullable: false),
                        AwayScore = c.Int(nullable: false),
                        Date = c.DateTime(nullable: false),
                        Outcome = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Players", t => t.AwayTeamId, cascadeDelete: false)
                .ForeignKey("dbo.Players", t => t.HomeTeamId, cascadeDelete: false)
                .Index(t => t.AwayTeamId)
                .Index(t => t.HomeTeamId);
            
            CreateTable(
                "dbo.PlayerLeagues",
                c => new
                    {
                        Player_Id = c.Int(nullable: false),
                        League_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Player_Id, t.League_Id })
                .ForeignKey("dbo.Players", t => t.Player_Id, cascadeDelete: false)
                .ForeignKey("dbo.Leagues", t => t.League_Id, cascadeDelete: false)
                .Index(t => t.Player_Id)
                .Index(t => t.League_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Matches", "HomeTeamId", "dbo.Players");
            DropForeignKey("dbo.Matches", "AwayTeamId", "dbo.Players");
            DropForeignKey("dbo.Leagues", "SeasonId", "dbo.Seasons");
            DropForeignKey("dbo.PlayerLeagues", "League_Id", "dbo.Leagues");
            DropForeignKey("dbo.PlayerLeagues", "Player_Id", "dbo.Players");
            DropIndex("dbo.Matches", new[] { "HomeTeamId" });
            DropIndex("dbo.Matches", new[] { "AwayTeamId" });
            DropIndex("dbo.Leagues", new[] { "SeasonId" });
            DropIndex("dbo.PlayerLeagues", new[] { "League_Id" });
            DropIndex("dbo.PlayerLeagues", new[] { "Player_Id" });
            DropTable("dbo.PlayerLeagues");
            DropTable("dbo.Matches");
            DropTable("dbo.Seasons");
            DropTable("dbo.Players");
            DropTable("dbo.Leagues");
        }
    }
}

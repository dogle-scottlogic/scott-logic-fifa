namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Countries",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 200),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "CountryName");
            
            CreateTable(
                "dbo.Leagues",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        SeasonId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Seasons", t => t.SeasonId, cascadeDelete: true)
                .Index(t => t.SeasonId);
            
            CreateTable(
                "dbo.Players",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Seasons",
                c => new
                    {
                        CountryId = c.Int(nullable: false),
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 200),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Countries", t => t.CountryId, cascadeDelete: true)
                .Index(t => new { t.CountryId, t.Name }, unique: true, name: "SeasonNameForCountry");
            
            CreateTable(
                "dbo.TeamPlayers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TeamId = c.Int(nullable: false),
                        PlayerId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Players", t => t.PlayerId, cascadeDelete: true)
                .ForeignKey("dbo.Teams", t => t.TeamId, cascadeDelete: true)
                .Index(t => t.TeamId)
                .Index(t => t.PlayerId);
            
            CreateTable(
                "dbo.Teams",
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
                        Id = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PlayerLeagues",
                c => new
                    {
                        Player_Id = c.Int(nullable: false),
                        League_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Player_Id, t.League_Id })
                .ForeignKey("dbo.Players", t => t.Player_Id, cascadeDelete: true)
                .ForeignKey("dbo.Leagues", t => t.League_Id, cascadeDelete: true)
                .Index(t => t.Player_Id)
                .Index(t => t.League_Id);
            
            CreateTable(
                "dbo.TeamPlayerSeasons",
                c => new
                    {
                        TeamPlayer_Id = c.Int(nullable: false),
                        Season_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.TeamPlayer_Id, t.Season_Id })
                .ForeignKey("dbo.TeamPlayers", t => t.TeamPlayer_Id, cascadeDelete: true)
                .ForeignKey("dbo.Seasons", t => t.Season_Id, cascadeDelete: true)
                .Index(t => t.TeamPlayer_Id)
                .Index(t => t.Season_Id);
           
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Leagues", "SeasonId", "dbo.Seasons");
            DropForeignKey("dbo.TeamPlayers", "TeamId", "dbo.Teams");
            DropForeignKey("dbo.TeamPlayerSeasons", "Season_Id", "dbo.Seasons");
            DropForeignKey("dbo.TeamPlayerSeasons", "TeamPlayer_Id", "dbo.TeamPlayers");
            DropForeignKey("dbo.TeamPlayers", "PlayerId", "dbo.Players");
            DropForeignKey("dbo.Seasons", "CountryId", "dbo.Countries");
            DropForeignKey("dbo.PlayerLeagues", "League_Id", "dbo.Leagues");
            DropForeignKey("dbo.PlayerLeagues", "Player_Id", "dbo.Players");
            DropIndex("dbo.TeamPlayerSeasons", new[] { "Season_Id" });
            DropIndex("dbo.TeamPlayerSeasons", new[] { "TeamPlayer_Id" });
            DropIndex("dbo.PlayerLeagues", new[] { "League_Id" });
            DropIndex("dbo.PlayerLeagues", new[] { "Player_Id" });
            DropIndex("dbo.TeamPlayers", new[] { "PlayerId" });
            DropIndex("dbo.TeamPlayers", new[] { "TeamId" });
            DropIndex("dbo.Seasons", "SeasonNameForCountry");
            DropIndex("dbo.Leagues", new[] { "SeasonId" });
            DropIndex("dbo.Countries", "CountryName");
            DropTable("dbo.TeamPlayerSeasons");
            DropTable("dbo.PlayerLeagues");
            DropTable("dbo.Matches");
            DropTable("dbo.Teams");
            DropTable("dbo.TeamPlayers");
            DropTable("dbo.Seasons");
            DropTable("dbo.Players");
            DropTable("dbo.Leagues");
            DropTable("dbo.Countries");
        }
    }
}

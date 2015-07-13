namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TeamPlayerLeagueAndMatchLeague : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.PlayerLeagues", "Player_Id", "dbo.Players");
            DropForeignKey("dbo.PlayerLeagues", "League_Id", "dbo.Leagues");
            DropForeignKey("dbo.TeamPlayerSeasons", "TeamPlayer_Id", "dbo.TeamPlayers");
            DropForeignKey("dbo.TeamPlayerSeasons", "Season_Id", "dbo.Seasons");
            DropIndex("dbo.PlayerLeagues", new[] { "Player_Id" });
            DropIndex("dbo.PlayerLeagues", new[] { "League_Id" });
            DropIndex("dbo.TeamPlayerSeasons", new[] { "TeamPlayer_Id" });
            DropIndex("dbo.TeamPlayerSeasons", new[] { "Season_Id" });
            CreateTable(
                "dbo.TeamPlayerLeagues",
                c => new
                    {
                        TeamPlayer_Id = c.Int(nullable: false),
                        League_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.TeamPlayer_Id, t.League_Id })
                .ForeignKey("dbo.TeamPlayers", t => t.TeamPlayer_Id, cascadeDelete: true)
                .ForeignKey("dbo.Leagues", t => t.League_Id, cascadeDelete: true)
                .Index(t => t.TeamPlayer_Id)
                .Index(t => t.League_Id);
            
            AddColumn("dbo.Matches", "League_Id", c => c.Int());
            CreateIndex("dbo.Matches", "League_Id");
            AddForeignKey("dbo.Matches", "League_Id", "dbo.Leagues", "Id");
            DropTable("dbo.PlayerLeagues");
            DropTable("dbo.TeamPlayerSeasons");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.TeamPlayerSeasons",
                c => new
                    {
                        TeamPlayer_Id = c.Int(nullable: false),
                        Season_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.TeamPlayer_Id, t.Season_Id });
            
            CreateTable(
                "dbo.PlayerLeagues",
                c => new
                    {
                        Player_Id = c.Int(nullable: false),
                        League_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Player_Id, t.League_Id });
            
            DropForeignKey("dbo.TeamPlayerLeagues", "League_Id", "dbo.Leagues");
            DropForeignKey("dbo.TeamPlayerLeagues", "TeamPlayer_Id", "dbo.TeamPlayers");
            DropForeignKey("dbo.Matches", "League_Id", "dbo.Leagues");
            DropIndex("dbo.TeamPlayerLeagues", new[] { "League_Id" });
            DropIndex("dbo.TeamPlayerLeagues", new[] { "TeamPlayer_Id" });
            DropIndex("dbo.Matches", new[] { "League_Id" });
            DropColumn("dbo.Matches", "League_Id");
            DropTable("dbo.TeamPlayerLeagues");
            CreateIndex("dbo.TeamPlayerSeasons", "Season_Id");
            CreateIndex("dbo.TeamPlayerSeasons", "TeamPlayer_Id");
            CreateIndex("dbo.PlayerLeagues", "League_Id");
            CreateIndex("dbo.PlayerLeagues", "Player_Id");
            AddForeignKey("dbo.TeamPlayerSeasons", "Season_Id", "dbo.Seasons", "Id", cascadeDelete: true);
            AddForeignKey("dbo.TeamPlayerSeasons", "TeamPlayer_Id", "dbo.TeamPlayers", "Id", cascadeDelete: true);
            AddForeignKey("dbo.PlayerLeagues", "League_Id", "dbo.Leagues", "Id", cascadeDelete: true);
            AddForeignKey("dbo.PlayerLeagues", "Player_Id", "dbo.Players", "Id", cascadeDelete: true);
        }
    }
}

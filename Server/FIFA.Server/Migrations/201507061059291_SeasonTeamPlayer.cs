namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SeasonTeamPlayer : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.TeamPlayers", "Team_Id", "dbo.Teams");
            DropForeignKey("dbo.TeamPlayers", "Player_Id", "dbo.Players");
            DropForeignKey("dbo.Players", "Season_Id", "dbo.Seasons");
            DropForeignKey("dbo.Teams", "Season_Id", "dbo.Seasons");
            DropIndex("dbo.TeamPlayers", new[] { "Team_Id" });
            DropIndex("dbo.TeamPlayers", new[] { "Player_Id" });
            DropIndex("dbo.Players", new[] { "Season_Id" });
            DropIndex("dbo.Teams", new[] { "Season_Id" });
            DropTable("dbo.TeamPlayers");
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
                .Index(t => t.PlayerId)
                .Index(t => t.TeamId);
            
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
            
            AddColumn("dbo.TeamPlayers", "Id", c => c.Int(nullable: false, identity: true));
            AddColumn("dbo.TeamPlayers", "TeamId", c => c.Int(nullable: false));
            AddColumn("dbo.TeamPlayers", "PlayerId", c => c.Int(nullable: false));
            DropPrimaryKey("dbo.TeamPlayers");
            AddPrimaryKey("dbo.TeamPlayers", "Id");
            DropColumn("dbo.Players", "Season_Id");
            DropColumn("dbo.Teams", "Season_Id");
            DropColumn("dbo.TeamPlayers", "Team_Id");
            DropColumn("dbo.TeamPlayers", "Player_Id");
            
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.TeamPlayers",
                c => new
                    {
                        Team_Id = c.Int(nullable: false),
                        Player_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Team_Id, t.Player_Id });
            
            AddColumn("dbo.TeamPlayers", "Player_Id", c => c.Int(nullable: false));
            AddColumn("dbo.TeamPlayers", "Team_Id", c => c.Int(nullable: false));
            AddColumn("dbo.Teams", "Season_Id", c => c.Int());
            AddColumn("dbo.Players", "Season_Id", c => c.Int());
            DropForeignKey("dbo.TeamPlayers", "TeamId", "dbo.Teams");
            DropForeignKey("dbo.TeamPlayerSeasons", "Season_Id", "dbo.Seasons");
            DropForeignKey("dbo.TeamPlayerSeasons", "TeamPlayer_Id", "dbo.TeamPlayers");
            DropForeignKey("dbo.TeamPlayers", "PlayerId", "dbo.Players");
            DropIndex("dbo.TeamPlayers", new[] { "TeamId" });
            DropIndex("dbo.TeamPlayerSeasons", new[] { "Season_Id" });
            DropIndex("dbo.TeamPlayerSeasons", new[] { "TeamPlayer_Id" });
            DropIndex("dbo.TeamPlayers", new[] { "PlayerId" });
            DropPrimaryKey("dbo.TeamPlayers");
            AddPrimaryKey("dbo.TeamPlayers", new[] { "Team_Id", "Player_Id" });
            DropColumn("dbo.TeamPlayers", "PlayerId");
            DropColumn("dbo.TeamPlayers", "TeamId");
            DropColumn("dbo.TeamPlayers", "Id");
            DropTable("dbo.TeamPlayerSeasons");
            DropTable("dbo.TeamPlayers");
            CreateIndex("dbo.Teams", "Season_Id");
            CreateIndex("dbo.Players", "Season_Id");
            CreateIndex("dbo.TeamPlayers", "Player_Id");
            CreateIndex("dbo.TeamPlayers", "Team_Id");
            AddForeignKey("dbo.Teams", "Season_Id", "dbo.Seasons", "Id");
            AddForeignKey("dbo.Players", "Season_Id", "dbo.Seasons", "Id");
            AddForeignKey("dbo.TeamPlayers", "Player_Id", "dbo.Players", "Id", cascadeDelete: true);
            AddForeignKey("dbo.TeamPlayers", "Team_Id", "dbo.Teams", "Id", cascadeDelete: true);
        }
    }
}

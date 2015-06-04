namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TeamsAndCountry : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Countries",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Teams",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TeamPlayers",
                c => new
                    {
                        Team_Id = c.Int(nullable: false),
                        Player_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Team_Id, t.Player_Id })
                .ForeignKey("dbo.Teams", t => t.Team_Id, cascadeDelete: true)
                .ForeignKey("dbo.Players", t => t.Player_Id, cascadeDelete: true)
                .Index(t => t.Team_Id)
                .Index(t => t.Player_Id);
            
            AddColumn("dbo.Seasons", "CountryId", c => c.Int(nullable: false));
            CreateIndex("dbo.Seasons", "CountryId");
            AddForeignKey("dbo.Seasons", "CountryId", "dbo.Countries", "Id", cascadeDelete: true);
            DropColumn("dbo.Players", "TeamName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Players", "TeamName", c => c.String(nullable: false));
            DropForeignKey("dbo.TeamPlayers", "Player_Id", "dbo.Players");
            DropForeignKey("dbo.TeamPlayers", "Team_Id", "dbo.Teams");
            DropForeignKey("dbo.Seasons", "CountryId", "dbo.Countries");
            DropIndex("dbo.TeamPlayers", new[] { "Player_Id" });
            DropIndex("dbo.TeamPlayers", new[] { "Team_Id" });
            DropIndex("dbo.Seasons", new[] { "CountryId" });
            DropColumn("dbo.Seasons", "CountryId");
            DropTable("dbo.TeamPlayers");
            DropTable("dbo.Teams");
            DropTable("dbo.Countries");
        }
    }
}

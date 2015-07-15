namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TeamPlayerUnique : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.TeamPlayers", new[] { "TeamId" });
            DropIndex("dbo.TeamPlayers", new[] { "PlayerId" });
            CreateIndex("dbo.TeamPlayers", new[] { "TeamId", "PlayerId" }, unique: true, name: "TeamPlayerUnique");
        }
        
        public override void Down()
        {
            DropIndex("dbo.TeamPlayers", "TeamPlayerUnique");
            CreateIndex("dbo.TeamPlayers", "PlayerId");
            CreateIndex("dbo.TeamPlayers", "TeamId");
        }
    }
}

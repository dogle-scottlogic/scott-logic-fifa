namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Added_seasonFK : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.PlayerLeagues", newName: "LeaguePlayers");
            AddColumn("dbo.Players", "Season_Id", c => c.Int());
            AddColumn("dbo.Teams", "Season_Id", c => c.Int());
            CreateIndex("dbo.Players", "Season_Id");
            CreateIndex("dbo.Teams", "Season_Id");
            AddForeignKey("dbo.Players", "Season_Id", "dbo.Seasons", "Id");
            AddForeignKey("dbo.Teams", "Season_Id", "dbo.Seasons", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Teams", "Season_Id", "dbo.Seasons");
            DropForeignKey("dbo.Players", "Season_Id", "dbo.Seasons");
            DropIndex("dbo.Teams", new[] { "Season_Id" });
            DropIndex("dbo.Players", new[] { "Season_Id" });
            DropColumn("dbo.Teams", "Season_Id");
            DropColumn("dbo.Players", "Season_Id");
            RenameTable(name: "dbo.LeaguePlayers", newName: "PlayerLeagues");
        }
    }
}

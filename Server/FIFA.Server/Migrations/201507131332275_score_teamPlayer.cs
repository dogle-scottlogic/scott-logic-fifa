namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class score_teamPlayer : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Scores", "PlayerId", "dbo.Players");
            DropIndex("dbo.Scores", new[] { "PlayerId" });
            AddColumn("dbo.Matches", "Played", c => c.Boolean(nullable: false));
            AddColumn("dbo.Scores", "TeamPlayerId", c => c.Int(nullable: true));
            CreateIndex("dbo.Scores", "TeamPlayerId");
            AddForeignKey("dbo.Scores", "TeamPlayerId", "dbo.TeamPlayers", "Id", cascadeDelete: false);
            DropColumn("dbo.Scores", "PlayerId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Scores", "PlayerId", c => c.Int(nullable: false));
            DropForeignKey("dbo.Scores", "TeamPlayerId", "dbo.TeamPlayers");
            DropIndex("dbo.Scores", new[] { "TeamPlayerId" });
            DropColumn("dbo.Scores", "TeamPlayerId");
            DropColumn("dbo.Matches", "Played");
            CreateIndex("dbo.Scores", "PlayerId");
            AddForeignKey("dbo.Scores", "PlayerId", "dbo.Players", "Id", cascadeDelete: false);
        }
    }
}

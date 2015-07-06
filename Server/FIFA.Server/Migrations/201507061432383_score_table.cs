namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class score_table : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Scores",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        MatchId = c.Int(nullable: false),
                        PlayerId = c.Int(nullable: false),
                        Goals = c.Int(nullable: false),
                        Location = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Matches", t => t.MatchId, cascadeDelete: true)
                .ForeignKey("dbo.Players", t => t.PlayerId, cascadeDelete: true)
                .Index(t => t.MatchId)
                .Index(t => t.PlayerId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Scores", "PlayerId", "dbo.Players");
            DropForeignKey("dbo.Scores", "MatchId", "dbo.Matches");
            DropIndex("dbo.Scores", new[] { "PlayerId" });
            DropIndex("dbo.Scores", new[] { "MatchId" });
            DropTable("dbo.Scores");
        }
    }
}

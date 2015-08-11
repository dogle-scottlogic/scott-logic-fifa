namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LinkSeasonsToRuleSets : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Seasons", "RuleSetId", c => c.Int(nullable: false, defaultValue: 1));
            CreateIndex("dbo.Seasons", "RuleSetId");
            AddForeignKey("dbo.Seasons", "RuleSetId", "dbo.RuleSets", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Seasons", "RuleSetId", "dbo.RuleSets");
            DropIndex("dbo.Seasons", new[] { "RuleSetId" });
            DropColumn("dbo.Seasons", "RuleSetId");
        }
    }
}

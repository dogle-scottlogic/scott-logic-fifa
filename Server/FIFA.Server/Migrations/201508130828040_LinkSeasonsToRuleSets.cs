namespace FIFA.Server.Migrations
{
    using Models;
    using System;
    using System.Data.Entity.Migrations;
    using System.Linq;

    public partial class LinkSeasonsToRuleSets : DbMigration
    {
        public override void Up()
        {
            Sql("SET IDENTITY_INSERT dbo.RuleSets ON");
            Sql("INSERT INTO dbo.RuleSets (Id, Name, LegsPlayedPerOpponent) SELECT 1, 'Standard League', 2 WHERE NOT EXISTS( select 1 from dbo.RuleSets where Id = 1 )");
            Sql("SET IDENTITY_INSERT dbo.RuleSets OFF");
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

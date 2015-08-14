namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PromotionPlaces : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.RuleSets", "NumPromotionPlaces", c => c.Int(nullable: false, defaultValue: 1));
        }
        
        public override void Down()
        {
            DropColumn("dbo.RuleSets", "NumPromotionPlaces");
        }
    }
}

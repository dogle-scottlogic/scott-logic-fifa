namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SeasonArchive : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Seasons", "Archived", c => c.Boolean(nullable: false, defaultValue: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Seasons", "Archived");
        }
    }
}

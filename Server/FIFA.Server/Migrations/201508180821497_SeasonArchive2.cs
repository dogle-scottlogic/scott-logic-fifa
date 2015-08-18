namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SeasonArchive2 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Seasons", "Archived");
            AddColumn("dbo.Seasons", "Archived", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Seasons", "Archived");
        }
    }
}

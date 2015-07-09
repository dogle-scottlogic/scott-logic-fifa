namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class playerArchive : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Players", "Archived", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Players", "Archived");
        }
    }
}

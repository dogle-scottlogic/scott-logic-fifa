namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nullable_match_date : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Matches", "Date", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Matches", "Date", c => c.DateTime(nullable: false));
        }
    }
}

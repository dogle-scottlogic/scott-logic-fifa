namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MatchIndexDate : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Matches", "Date", name: "DateOfMatch");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Matches", "DateOfMatch");
        }
    }
}

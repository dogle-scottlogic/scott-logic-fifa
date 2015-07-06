namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TeamCountryFk : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Teams", "CountryId", c => c.Int(nullable: false));
            CreateIndex("dbo.Teams", "CountryId");
            AddForeignKey("dbo.Teams", "CountryId", "dbo.Countries", "Id", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Teams", "CountryId", "dbo.Countries");
            DropIndex("dbo.Teams", new[] { "CountryId" });
            DropColumn("dbo.Teams", "CountryId");
        }
    }
}

namespace FIFA.Server.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UniqueNameCountryAndSeason : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Seasons", new[] { "CountryId" });
            AlterColumn("dbo.Countries", "Name", c => c.String(nullable: false, maxLength: 200));
            AlterColumn("dbo.Seasons", "Name", c => c.String(nullable: false, maxLength: 200));
            CreateIndex("dbo.Countries", "Name", unique: true, name: "CountryName");
            CreateIndex("dbo.Seasons", new[] { "CountryId", "Name" }, unique: true, name: "SeasonNameForCountry");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Seasons", "SeasonNameForCountry");
            DropIndex("dbo.Countries", "CountryName");
            AlterColumn("dbo.Seasons", "Name", c => c.String(nullable: false));
            AlterColumn("dbo.Countries", "Name", c => c.String(nullable: false));
            CreateIndex("dbo.Seasons", "CountryId");
        }
    }
}

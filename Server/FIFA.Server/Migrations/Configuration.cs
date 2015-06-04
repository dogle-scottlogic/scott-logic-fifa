namespace FIFA.Server.Migrations
{
    using FIFA.Server.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<FIFA.Server.Models.FIFAServerContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(FIFA.Server.Models.FIFAServerContext context)
        {
            context.Players.AddOrUpdate(x => x.Id,
                new Player() { Id = 2, Name = "Steven" }
            );
        }
    }
}

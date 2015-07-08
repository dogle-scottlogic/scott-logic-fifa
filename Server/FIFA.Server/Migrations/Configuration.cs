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
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(FIFA.Server.Models.FIFAServerContext context)
        {
            //  This method will be called after migrating to the latest version.

            // Populating the countries
            context.Countries.AddOrUpdate(
                c => c.Id,
                new Country { Id = 1, Name = "Scotland" },
                new Country { Id = 2, Name = "Romania" },
                new Country { Id = 3, Name = "England" },
                new Country { Id = 4, Name = "France" }
            );


            // Populating the seasons
            context.Seasons.AddOrUpdate(
                s => s.Id,
                new Season { Id = 1, Name = "2009–10", CountryId = 1 },
                new Season { Id = 2, Name = "2010–11", CountryId = 1 },
                new Season { Id = 3, Name = "2009–10", CountryId = 2 },
                new Season { Id = 4, Name = "2010–11", CountryId = 2 }
            );


            // Populating the leagues
            context.Leagues.AddOrUpdate(
                l => l.Id,
                new League { Id = 1, Name = "League XI", SeasonId = 1 },
                new League { Id = 2, Name = "League XI", SeasonId = 2 },
                new League { Id = 3, Name = "Liga I", SeasonId = 3 },
                new League { Id = 4, Name = "Liga I", SeasonId = 4 },
                new League { Id = 5, Name = "Liga II", SeasonId = 4 }
            );


            // Populating the players
            context.Players.AddOrUpdate(
                p => p.Id,
                new Player { Id = 1, Name = "Anda"},
                new Player { Id = 2, Name = "Steven"},
                new Player { Id = 3, Name = "Fabien"}
            );


        }
    }
}

using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class FIFAServerContext : IdentityDbContext<IdentityUser>
    {
    
        public FIFAServerContext() : base("FIFAServerContext")
        {
            base.Configuration.ProxyCreationEnabled = false;
        }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Season> Seasons { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Player> Players { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.League> Leagues { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Match> Matches { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Team> Teams { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Country> Countries { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Score> Scores { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Upload> Uploads { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.TeamPlayer> TeamPlayers { get; set; }
    }
}

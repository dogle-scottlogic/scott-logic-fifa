using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class FIFAServerContext : DbContext
    {
    
        public FIFAServerContext() : base("name=FIFAServerContext") { }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Season> Seasons { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Player> Players { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.League> Leagues { get; set; }

        public System.Data.Entity.DbSet<FIFA.Server.Models.Match> Matches { get; set; }
    
    }
}

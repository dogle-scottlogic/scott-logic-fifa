using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class League
    {
        public League()
        {
            this.Players = new HashSet<Player>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int SeasonId { get; set; }

        [ForeignKey("SeasonId")]
        public Season Season { get; set; }

        public virtual ICollection<Player> Players { get; set; }
    }
}
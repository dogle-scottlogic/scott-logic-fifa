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

        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        [ForeignKey("Season")]
        public int SeasonId { get; set; }

        public Season Season { get; set; }

        public virtual ICollection<TeamPlayer> TeamPlayers { get; set; }
        public virtual ICollection<Match> Matches { get; set; }
    }
}
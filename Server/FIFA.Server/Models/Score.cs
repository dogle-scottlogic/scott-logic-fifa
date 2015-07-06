using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public enum Location
    {
        Home = 1,
        Away = 2
    }

    public class Score
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Match")]
        public int MatchId { get; set; }

        [ForeignKey("Player")]
        public int PlayerId { get; set; }
        
        public int Goals { get; set; }

        public virtual Match Match { get; set; }
        public virtual Player Player { get; set; }

        [Range(1, 2), Display(Name = "Location")]
        public Location Location { get; set; }

    }
}
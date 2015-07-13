using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{

    public class Match
    {
        [Key]
        public int Id { get; set; }

        public DateTime? Date { get; set; }

        [ForeignKey("League")]
        public int LeagueId;

        public virtual League League { get; set; }

        public virtual ICollection<Score> Scores { get; set; }

    }
}
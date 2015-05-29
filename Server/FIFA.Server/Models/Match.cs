using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public enum Outcome
    {
        Home = 1,
        Away = 2,
        Draw = 3
    }

    public class Match
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("HomeTeam"), Column(Order = 0)]
        public int HomeTeamId { get; set; }

        [ForeignKey("AwayTeam"), Column(Order = 1)]
        public int AwayTeamId { get; set; }

        public int HomeScore { get; set; }
        public int AwayScore { get; set; }
        public DateTime Date { get; set; }

        [Range(1, 3), Display(Name = "Outcome")]
        public Outcome Outcome { get; set; }

        public virtual Player HomeTeam { get; set; }
        public virtual Player AwayTeam { get; set; }
    }
}
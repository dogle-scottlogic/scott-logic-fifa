using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class GenerateLeagueDTO
    {
        public GenerateLeagueDTO()
        {
        }

        public int SeasonId { get; set; }
        public ICollection<Player> Players { get; set; }

    }
}
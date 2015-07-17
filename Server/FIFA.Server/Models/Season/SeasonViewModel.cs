using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{

    // Class the season name with all it s leagues
    public class SeasonViewModel
    {
         public int Id { get; set; }
         public string Name { get; set; }
         public IEnumerable<LeagueViewModel> LeagueViewModels { get; set; }
    }
}
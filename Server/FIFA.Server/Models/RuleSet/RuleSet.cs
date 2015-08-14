using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class RuleSet
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public int LegsPlayedPerOpponent { get; set; }

        public int NumPromotionPlaces { get; set; }

    }
}
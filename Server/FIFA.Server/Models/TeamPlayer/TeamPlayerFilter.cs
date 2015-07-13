using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class TeamPlayerFilter
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int PlayerId { get; set; }
    }
}
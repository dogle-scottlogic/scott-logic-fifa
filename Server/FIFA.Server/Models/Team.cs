using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class Team
    {
        public Team()
        {
            this.Players = new HashSet<Player>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public virtual ICollection<Player> Players { get; set; }
    }
}
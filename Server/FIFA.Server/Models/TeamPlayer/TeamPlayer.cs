using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class TeamPlayer
    {
        [Key]
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int PlayerId { get; set; }

        [ForeignKey("TeamId")]
        public Team Team { get; set; }

        [ForeignKey("PlayerId")]
        public Player Player { get; set; }

        public virtual ICollection<League> Leagues { get; set; }
    }
}
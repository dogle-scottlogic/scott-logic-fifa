using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class Season
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Index("SeasonNameForCountry", 2, IsUnique = true)]
        [StringLength(200)]
        public string Name { get; set; }

        [ForeignKey("SeasonCountry"), Column(Order = 0)]
        [Index("SeasonNameForCountry", 1, IsUnique = true)]
        public int CountryId { get; set; }

        public virtual Country SeasonCountry  { get; set; }

        public virtual ICollection<TeamPlayer> TeamPlayers { get; set; }
    }
}
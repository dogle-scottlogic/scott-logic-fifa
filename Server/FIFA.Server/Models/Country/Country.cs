using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class Country
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Index("CountryName", IsUnique = true)]
        [StringLength(200)]
        public string Name { get; set; }

        public virtual ICollection<Season> Seasons { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace FIFA.Server.Models
{
    public class Player
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public bool Archived { get; set; }

    }
}
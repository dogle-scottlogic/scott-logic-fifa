using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class Upload
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public byte[] Data { get; set; }

        [Required]
        public string MimeType { get; set; }
    }
}
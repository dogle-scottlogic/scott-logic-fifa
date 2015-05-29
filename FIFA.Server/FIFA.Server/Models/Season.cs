﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class Season
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
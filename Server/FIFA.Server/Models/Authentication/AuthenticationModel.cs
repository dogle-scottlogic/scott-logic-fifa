using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models.Authentication
{
    public class AuthenticationModel
    {
        [Key]
        public string ID { get; set; }

        public string UserName { get; set; }

        public IEnumerable<ClaimModel> Claims { get; set; }
    }
}
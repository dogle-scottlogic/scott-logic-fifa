using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    // Model representing an user
    public class UserModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public bool AdministratorRole { get; set; }
    }
}
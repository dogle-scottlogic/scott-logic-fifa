using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public interface ICountryRepository : ICRUDRepository<Country, int>
    {
    }
}

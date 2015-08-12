using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public interface ICountryRepository : ICRUDRepository<Country, int, IQueryFilter<Country>>
    {
        Task<bool> isCountryNameExist(string countryName, int? Id);
    }
}

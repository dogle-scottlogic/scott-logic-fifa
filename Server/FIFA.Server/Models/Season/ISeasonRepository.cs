using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public interface ISeasonRepository : ICRUDRepository<Season, int>
    {
        Task<bool> isSeasonNameExist(int countryId, string seasonName, int? Id);
    }
}

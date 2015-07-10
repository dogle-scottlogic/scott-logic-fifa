using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FIFA.Server.Models
{
    public interface ITeamRepository : ICRUDRepository<Team, int, TeamFilter>
    {
        Task<bool> teamNameExists(string name, int countryId, int? id);
    }
}

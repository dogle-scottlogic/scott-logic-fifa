using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FIFA.Server.Models
{
    public interface ITeamPlayerRepository : ICRUDRepository<TeamPlayer, int, TeamPlayerFilter>
    {
    }
}

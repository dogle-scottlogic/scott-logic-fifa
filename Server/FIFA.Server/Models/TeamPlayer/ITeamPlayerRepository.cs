using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FIFA.Server.Models
{
    public interface ITeamPlayerRepository : ICRUDRepository<TeamPlayer, int, TeamPlayerFilter>
    {
        Task<IEnumerable<TeamPlayer>> GetAllWithUnplayedMatches(Location location, MatchFilter filter);

        Task<IEnumerable<TeamPlayer>> GetAvailableAwayOpponents(int id, MatchFilter filter);

        Task<TeamPlayerSeasonStatisticViewModel> GetTeamPlayerStatisticForASeason(int teamPlayerId, int seasonId);
    }
}

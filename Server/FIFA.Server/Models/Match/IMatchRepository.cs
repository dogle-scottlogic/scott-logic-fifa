using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public interface IMatchRepository : ICRUDRepository<Match, int, MatchFilter>
    {
        Task<Match> GetMatchByPlayers(int homePlayerId, int awayPlayerId);
    }
}

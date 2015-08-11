using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FIFA.Server.Models
{
    public interface IRuleSetRepository : ICRUDRepository<RuleSet, int, RuleSetFilter>
    {
        Task<List<Match>> createMatchAndScore(IEnumerable<TeamPlayer> teamPlayers, int ruleSetId);
    }
}

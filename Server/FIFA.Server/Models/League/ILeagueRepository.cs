using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public interface ILeagueRepository : ICRUDRepository<League, int, LeagueFilter>
    {
        Task<bool> isLeagueNameExist(int seasonId, string leagueName, int? Id);
        Task<LeagueViewModel> GetViewModel(int Id);
        Task<League> createLeagueWithTeamPlayers(League leagueInCreation, List<TeamPlayer> teamPlayers);
    }
}

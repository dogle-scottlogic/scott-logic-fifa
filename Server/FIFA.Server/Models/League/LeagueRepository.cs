using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class LeagueRepository : ILeagueRepository
    {
        private FIFAServerContext db;
        private IRuleSetRepository ruleSetRepo;

        public LeagueRepository(FIFAServerContext db, IRuleSetRepository ruleSetRepo)
        {
            this.db = db;
            this.ruleSetRepo = ruleSetRepo;
        }
        
        public async Task<IEnumerable<League>> GetAll()
        {
            return await this.db.Leagues
                .OrderBy(l => l.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<League>> GetAllWithFilter(LeagueFilter filter)
        {
            return await this.FilterLeagues(this.db.Leagues, filter)
                .OrderBy(l => l.Name)
                .ToListAsync();
        }

        private IQueryable<League> FilterLeagues(IQueryable<League> query, LeagueFilter filter)
        {
            if (filter != null)
            {
                query = filter.FilterLeagues(query);
                
            }

            return query;
        }

        public async Task<League> Get(int id)
        {
            League league = await db.Leagues.Where(l => l.Id == id).Include(s => s.Season).FirstAsync();
            return league;
        }

        public async Task<League> Add(League item)
        {
            db.Leagues.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        public async Task<bool> Update(int id, League item)
        {
            if (item == null)
            {
                return false;
            }

            item.Id = id;

            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Remove(int id)
        {    
            League league = db.Leagues.Find(id);

            if (league == null)
            {
                return false;
            }

            db.Leagues.Remove(league);
            await db.SaveChangesAsync();

            return true;
        }
        
        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }

        /**
         * Verify if the league name already exists for this season
         **/
        public async Task<bool> isLeagueNameExist(int seasonId, string leagueName, int? Id)
        {
            return await db.Leagues.AnyAsync(l => l.Name == leagueName && l.SeasonId == seasonId && (Id == null || l.Id != Id));
        }

        /**
         * Getting the view Model
         **/
        public async Task<LeagueViewModel> GetViewModel(int id)
        {
            var lvm = await db.Leagues
            .Where(l => l.Id == id)
            .Select(l => new LeagueViewModel
            {
                Id = l.Id,
                Name = l.Name,
                TeamPlayers = l.TeamPlayers.Select(tp => new TeamPlayerViewModel
                {
                    player = tp.Player,
                    team = tp.Team
                })
            })
            .SingleOrDefaultAsync();


            return lvm;
        }

        /**
         * Create the season with the teams and in function of the list of team players
         */ 
         public async Task<Season> createSeasonWithLeagues(Season seasonInCreation, List<League> leaguesInCreation)
        {
            seasonInCreation = db.Seasons.Add(seasonInCreation);
            await db.SaveChangesAsync();

            // for each league of the season we create the teamplayers if they don't already exists
            foreach (League leagueInCreation in leaguesInCreation)
            {
                leagueInCreation.Season = seasonInCreation;
                League createdLeague = await createLeagueWithTeamPlayers(leagueInCreation, seasonInCreation.RuleSetId);
            }
            await db.SaveChangesAsync();


            return seasonInCreation;
        }

        /**
         * Create teamPlayers attached to the league
         */
        private async Task<League> createLeagueWithTeamPlayers(League leagueInCreation, int ruleSetId)
        {
            List<TeamPlayer> teamPlayersCreated = new List<TeamPlayer>();
            // for each team players, we see in database if it already exists, if so, we add it to the leage without creating it before
            foreach (TeamPlayer tp in leagueInCreation.TeamPlayers)
            {
                TeamPlayer dbTeamPlayer = this.db.TeamPlayers.Where(tpWhere => tpWhere.PlayerId == tp.PlayerId
                    && tpWhere.TeamId == tp.TeamId).FirstOrDefault();
                if (dbTeamPlayer != null)
                {
                    teamPlayersCreated.Add(dbTeamPlayer);
                }
                else
                {
                    // Add the team players to the season
                    teamPlayersCreated.Add(tp);
                }

            }
            leagueInCreation.TeamPlayers = teamPlayersCreated;

            // we update the league then
            leagueInCreation = this.db.Leagues.Add(leagueInCreation);
            await db.SaveChangesAsync();

            // Then we create the matches and the scores
            leagueInCreation.Matches = await ruleSetRepo.createMatchAndScore(leagueInCreation.TeamPlayers, ruleSetId);
            db.Entry(leagueInCreation).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return leagueInCreation;
        }

    }
}
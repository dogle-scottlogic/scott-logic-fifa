using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using FIFA.Server.Models;
using System.Threading.Tasks;
using FIFA.Server.Infrastructure;

namespace FIFA.Server.Controllers
{
    // Controller used to generate a league
    [ConfigurableCorsPolicy("localhost")]
    public class GenerateLeagueController : ApiController
    {
        public const int minNumberOfPlayers = 4;
        public const int maxNumberOfPlayersByLeague = 6;

        ILeagueRepository leagueRepository;
        ISeasonRepository seasonRepository;
        ITeamRepository teamRepository;
        
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public GenerateLeagueController(ILeagueRepository leagueRepository, ISeasonRepository seasonRepository, ITeamRepository teamRepository)
        {
            this.leagueRepository = leagueRepository;
            this.seasonRepository = seasonRepository;
            this.teamRepository = teamRepository;
        }

        [ResponseType(typeof(List<League>))]
        public async Task<HttpResponseMessage> Get(int numberOfPlayers)
        {
            List<League> leagues = new List<League>();
            leagues.Add(new League {Id = 1, Name = "League 1"});
            leagues.Add(new League { Id = 2, Name = "League 2" });
            return Request.CreateResponse(HttpStatusCode.OK, leagues);
        }

        /// <summary>
        ///     Generate the league(s)
        /// </summary>
        /// <param name="item">The league with the players</param>
        /// <returns>Return a leagueModel if created and its uri to retrieve it</returns>
        /// 
            // POST api/League
        [ResponseType(typeof(League))]
        public async Task<HttpResponseMessage> Post(GenerateLeagueDTO item)
        {
            // try to get the season, if it returns null, send an error
            if (item == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Item is empty");

            } 
            else if (!await this.isSeasonExist(item.SeasonId))
            {
                return this.createErrorResponseSeasonDoesntExists();
            }
            else if (await this.isLeagueAlreadyExistInThisSeason(item.SeasonId))
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Creation impossible some leagues already exists for this season");
            }else{

                // get the season
                Season season = await this.seasonRepository.Get(item.SeasonId);
                
                // retrieving the teams associated to the country
                List<Team> teams = new List<Team>(await this.getTeamsAssociatedToTheCountry(season.CountryId));

                // Counting the total of players inserted
                int totalOfPlayers = 0;
                foreach(var playerLeagues in item.PlayerLeagues)
                {
                    totalOfPlayers += playerLeagues.Players.Count();
                }

                // Their will be at least <minNumberOfPlayers> players
                if (totalOfPlayers < minNumberOfPlayers)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You must choose at least 4 players.");
                }
                // The number of player should be even
                else if (totalOfPlayers % 2 != 0)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You must choose an even number of players.");
                }
                // If their is less team than players, the server respond an error
                else if (teams.Count() < totalOfPlayers)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Not enough team exists for this country.");
                }
                else if (ModelState.IsValid)
                {
                    // Generate the league
                    return await this.GenerateLeagues(season, teams, new List<PlayerAssignLeagueModel>(item.PlayerLeagues));
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                
            }
        }
        
        // Method generating the league
        private async Task<HttpResponseMessage> GenerateLeagues(Season season, List<Team> teams, List<PlayerAssignLeagueModel> playerleagues)
        {

            Random rand = new Random();

            // For each player leagu in player leagues, we genereage a league
            foreach(PlayerAssignLeagueModel playerleague in playerleagues)
            {

                string leagueName = playerleague.league.Name;
                // First we create the league attached to the players
                League createdLeague = await this.createLeagueWithTeams(season.Id, leagueName, playerleague.Players, teams, rand);
            }

            var response = Request.CreateResponse<int>(HttpStatusCode.Created, season.Id);

            return response;

        }

        /**
         * Create a league with the teamplayers
         */
        private async Task<League> createLeagueWithTeams(int seasonId, string leagueName, IEnumerable<Player> players, List<Team> teams, Random rand)
        {
            League leagueInCreation = new League();
            leagueInCreation.Name = leagueName;
            leagueInCreation.SeasonId = seasonId;

            List<TeamPlayer> teamPlayers = new List<TeamPlayer>();

            // for each players, we choose randomly a team
            foreach (Player player in players)
            {
                // picking a team randomly from the list of teams an add to the player
                int teamPosition = rand.Next(0, teams.Count() - 1);
                Team team = teams.ElementAt(teamPosition);
                // remove from the teamlist the selected team
                teams.RemoveAt(teamPosition);

                //we add the team player if not exists
                TeamPlayer tp = new TeamPlayer();
                tp.PlayerId = player.Id;
                tp.TeamId = team.Id;

                // Add the team players to the season
                teamPlayers.Add(tp);

            }

            return await this.leagueRepository.createLeagueWithTeamPlayers(leagueInCreation, teamPlayers);
        }
        

        
        // Get the list of the teams associated to the country Id
        private async Task<IEnumerable<Team>> getTeamsAssociatedToTheCountry(int countryId){
            TeamFilter teamFilter = new TeamFilter();
            teamFilter.CountryId = countryId;
            return await this.teamRepository.GetAllWithFilter(teamFilter);
        }
        
        /**
         * Method verifying if a season exist in the item
         **/
        private async Task<bool> isSeasonExist(int seasonId)
        {
            Season season = await this.seasonRepository.Get(seasonId);
            return (season != null);
        }

        /**
         * Method verifying if at least one league is attached to the season
         **/
        private async Task<bool> isLeagueAlreadyExistInThisSeason(int seasonId)
        {
            LeagueFilter lf = new LeagueFilter();
            lf.SeasonId = seasonId;
            IEnumerable<League> leagues = await this.leagueRepository.GetAllWithFilter(lf);
            return (leagues != null && leagues.Count() > 0);
        }

        /**
         * Creating an error message indicating that the season doesn't exist
         **/
        private const string seasonDoesntExistsError = "The season doesn't exist";
        private HttpResponseMessage createErrorResponseSeasonDoesntExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, seasonDoesntExistsError);
        }



    }
}
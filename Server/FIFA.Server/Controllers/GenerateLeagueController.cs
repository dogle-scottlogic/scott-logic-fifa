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

        ILeagueRepository repository;
        ISeasonRepository seasonRepository;
        ITeamRepository teamRepository;
        ITeamPlayerRepository teamPlayerRepository;
        IPlayerRepository playerRepository;
        
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public GenerateLeagueController(ILeagueRepository leagueRepository, ISeasonRepository seasonRepository, ITeamRepository teamRepository, ITeamPlayerRepository teamPlayerRepository, IPlayerRepository playerRepository)
        {
            this.repository = leagueRepository;
            this.seasonRepository = seasonRepository;
            this.teamRepository = teamRepository;
            this.teamPlayerRepository = teamPlayerRepository;
            this.playerRepository = playerRepository;
        }


        /// <summary>
        ///     Generate the league(s)
        /// </summary>
        /// <param name="item">The league with the players</param>
        /// <returns>Return a leagueModel if created and its uri to retrieve it</returns>
        /// 
        // POST api/League
        [ResponseType(typeof(League))]
        public async Task<HttpResponseMessage> Post(League item)
        {
            // try to get the season, if it returns null, send an error
            if (item == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Item is empty");

            } 
            else if (!await this.isSeasonExist(item))
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

                // Their will be at least 4 players
                if (item.Players.Count() < 4)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You must choose at least 4 players.");
                }
                // The number of player should be even
                else if (item.Players.Count() % 2 != 0)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You must choose an even number of players.");
                }
                // If their is less team than players, the server respond an error
                else if (teams.Count() < item.Players.Count())
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Not enough team exists for this country.");
                }
                else if (ModelState.IsValid)
                {
                    // Generate the league
                    return await this.GenerateLeagues(season, teams, item.Players);
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                
            }
        }
        
        // Method generating the league -- TODO generate multiple leagues if more than 8 players
        private async Task<HttpResponseMessage> GenerateLeagues(Season season, List<Team> teams, IEnumerable<Player> players)
        {

            Random rand = new Random();
            // First we create the league attached to the players
            League createdLeague = await createLeagueAttachedToPlayers(season.Id, "", players);

            // Second we create the league attached to the players
            createdLeague.Season = await createTeamAttachedToSeason(season, teams, players, rand);

            var response = Request.CreateResponse<League>(HttpStatusCode.Created, createdLeague);

            return response;

        }


        /**
         * Create league attached to the season and the player
         */
        private async Task<League> createLeagueAttachedToPlayers(int seasonId, string leagueName, IEnumerable<Player> players)
        {
            League leagueInCreation = new League();
            // if the name is not created, we fill it
            if (leagueName == "")
            {
                leagueName = "League 1";
            }
            leagueInCreation.Name = leagueName;
            leagueInCreation.SeasonId = seasonId;

            // Create the league in the database
            leagueInCreation = await this.repository.Add(leagueInCreation);

            // for each players, we attach him to the league
            foreach (Player player in players)
            {
                // retrieving the player and adding the season
                Player playerToUpdate = await this.playerRepository.Get(player.Id);
                if (playerToUpdate.Leagues == null)
                {
                    playerToUpdate.Leagues = new List<League>();
                }
                playerToUpdate.Leagues.Add(leagueInCreation);
                await this.playerRepository.Update(playerToUpdate.Id, playerToUpdate);
            }

            return leagueInCreation;
        }

        /**
         * Create teamPlayers attached to the season
         */
        private async Task<Season> createTeamAttachedToSeason(Season season, List<Team> teams, IEnumerable<Player> players, Random rand)
        {
            List<TeamPlayer> teamPlayers = new List<TeamPlayer>();

            // for each players, we choose randomly a team
            foreach (Player player in players)
            {
                // picking a team randomly from the list of teams an add to the player
                int teamPosition = rand.Next(0, teams.Count()-1);
                Team team = teams.ElementAt(teamPosition);
                // remove from the teamlist the selected team
                teams.RemoveAt(teamPosition);
                    
                //we add the team player if not exists
                TeamPlayer tp = new TeamPlayer();
                tp.PlayerId = player.Id;
                tp.TeamId = team.Id;

                TeamPlayerFilter teamPlayerFilter = new TeamPlayerFilter();
                teamPlayerFilter.PlayerId = tp.PlayerId;
                teamPlayerFilter.TeamId = tp.TeamId;
                IEnumerable<TeamPlayer> dbTeamPlayer = await this.teamPlayerRepository.GetAllWithFilter(teamPlayerFilter);
                if (dbTeamPlayer == null || dbTeamPlayer.Count() == 0)
                {
                    // If the team player doesn't exists, we add him in the repository
                    tp = await this.teamPlayerRepository.Add(tp);
                }

                // If the list of teamPlayers is empty, we create a list
                if (season.TeamPlayers == null)
                {
                    season.TeamPlayers = new List<TeamPlayer>();
                }

                // Add the team players to the season
                season.TeamPlayers.Add(tp);
            }

            // Adding the teamplayers to the season
            await this.seasonRepository.Update(season.Id, season);


            return season;
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
        private async Task<bool> isSeasonExist(League item)
        {
            if (item == null)
            {
                return false;
            }
            else
            {
                Season season = await this.seasonRepository.Get(item.SeasonId);
                return (season != null);

            }
        }

        /**
         * Method verifying if at least one league is attached to the season
         **/
        private async Task<bool> isLeagueAlreadyExistInThisSeason(int seasonId)
        {
            LeagueFilter lf = new LeagueFilter();
            lf.SeasonId = seasonId;
            IEnumerable<League> leagues = await this.repository.GetAllWithFilter(lf);
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
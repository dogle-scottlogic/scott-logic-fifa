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
using FIFA.Server.Authentication;

namespace FIFA.Server.Controllers
{
    // Controller used to generate a league
    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require authenticated requests.
    [ConfigurableCorsPolicy("localhost")]
    public class GenerateLeagueController : ApiController
    {
        public const int MinNumberOfPlayers = 4;
        public const int MaxNumberOfPlayersByLeague = 6;
        public const int MinNumberOfPlayersByLeague = 2;

        ILeagueRepository leagueRepository;
        ISeasonRepository seasonRepository;
        ITeamRepository teamRepository;
        ICountryRepository countryRepository;
        
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public GenerateLeagueController(ILeagueRepository leagueRepository, ISeasonRepository seasonRepository, ITeamRepository teamRepository, ICountryRepository countryRepository)
        {
            this.leagueRepository = leagueRepository;
            this.seasonRepository = seasonRepository;
            this.teamRepository = teamRepository;
            this.countryRepository = countryRepository;
        }

        // Method checking that the number of players is ok regarding to the rules, if not, return a non empty string with the error
        // message
        private String checkNumberOfPlayersRules(int totalOfPlayers, int totalOfTeamAvalaible)
        {
            // Their will be at least <minNumberOfPlayers> players
            if (totalOfPlayers < MinNumberOfPlayers)
            {
                return "You must choose at least 4 players.";
            }
            // If their is less team than players, the server respond an error
            else if (totalOfTeamAvalaible < totalOfPlayers)
            {
                return "Not enough team exists for this country.";
            }
            else
            {
                return null;
            }
        }

        [ResponseType(typeof(List<League>))]
        public async Task<HttpResponseMessage> Get(int numberOfPlayers, [FromUri]GenerateLeagueDTO item = null)
        {

            // retrieving the teams associated to the country
            List<Team> teams = new List<Team>(await this.getTeamsAssociatedToTheCountry(item.CountryId));

            if (item == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Item is empty");

            }
            else if (!await this.isCountryExist(item.CountryId))
            {
                return this.createErrorResponseCountryDoesntExists();
            }
            else if (await this.seasonRepository.isSeasonNameExist(item.CountryId, item.SeasonName, null))
            {
                return this.createErrorResponseSeasonNameExists();
            }
            else
            {

            // Checking that everything is ok for the league generation
            string errorString = checkNumberOfPlayersRules(numberOfPlayers, teams.Count());

            // returning an error if errorString is not empty
            if (errorString != null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorString);
            } else { 

                List<League> leagues = new List<League>();
                int leagueNumber = 1;
            
                // For each <maxNumberOfPlayersByLeague>, we create an other league
                while (numberOfPlayers > 0)
                {
                    string leagueName = "League " + leagueNumber;

                    // If numberOfPlayers / maxNumberOfPlayersByLeague > 2, we remove the max number of players
                    if ((numberOfPlayers / MaxNumberOfPlayersByLeague) >= 2)
                    {
                        numberOfPlayers -= MaxNumberOfPlayersByLeague;
                    }
                    else if (numberOfPlayers > MaxNumberOfPlayersByLeague)
                    {
                        numberOfPlayers -= MinNumberOfPlayers;
                    }
                    else
                    {
                        numberOfPlayers = 0;
                    }

                    leagues.Add(new League {Id = leagueNumber, Name = leagueName });

                    leagueNumber++;

                }
                return Request.CreateResponse(HttpStatusCode.OK, leagues);
                }
            }

        }
        
        /// <summary>
        ///     Generate the league(s)
        /// </summary>
        /// <param name="item">The league with the players</param>
        /// <returns>Return a leagueModel if created and its uri to retrieve it</returns>
        /// 
            // POST api/League
        [ResponseType(typeof(League))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Post(GenerateLeagueDTO item)
        {
            // try to get the season, if it returns null, send an error
            if (item == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Item is empty");

            }
            else if (!await this.isCountryExist(item.CountryId))
            {
                return this.createErrorResponseCountryDoesntExists();
            }
            else if (await this.seasonRepository.isSeasonNameExist(item.CountryId, item.SeasonName, null))
            {
                return this.createErrorResponseSeasonNameExists();
            }else{

                // get the season
                Season season = new Season {CountryId = item.CountryId, Name = item.SeasonName };
                
                // retrieving the teams associated to the country
                List<Team> teams = new List<Team>(await this.getTeamsAssociatedToTheCountry(item.CountryId));

                // Counting the total of players inserted and verifying that all the leagues are correctly filled
                int totalOfPlayers = 0;
                foreach(var playerLeagues in item.PlayerLeagues)
                {
                    if(playerLeagues.league == null || playerLeagues.league.Name == "")
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "All the leagues must have a name.");
                    }
                    totalOfPlayers += playerLeagues.Players.Count();
                }

                string errorString = checkNumberOfPlayersRules(totalOfPlayers, teams.Count());
                // Their will be at least <minNumberOfPlayers> players
                if (errorString != null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorString);
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
            List<League> leaguesInCreation = new List<League>();

            // For each player league in player leagues, we genereage a league
            foreach (PlayerAssignLeagueModel playerleague in playerleagues)
            {
                if(playerleague.Players != null && playerleague.Players.Count > 0)
                {
                    if (playerleague.Players.Count < MinNumberOfPlayersByLeague)
                    {
                        string errorMessage = "A league must have at least " + MinNumberOfPlayersByLeague + " players";
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, errorMessage);
                    }
                    string leagueName = playerleague.league.Name;
                    // We create the league attached to the players only if their is at least one player into
                    League createdLeague = await this.createLeagueWithTeams(leagueName, playerleague.Players, teams, rand);
                    leaguesInCreation.Add(createdLeague);
                }
            }

            season = await this.leagueRepository.createSeasonWithLeagues(season, leaguesInCreation);

            var response = Request.CreateResponse<int>(HttpStatusCode.Created, season.Id);

            return response;

        }

        /**
         * Create a league with the teamplayers
         */
        private async Task<League> createLeagueWithTeams(string leagueName, IEnumerable<Player> players, List<Team> teams, Random rand)
        {
            League leagueInCreation = new League();
            leagueInCreation.Name = leagueName;

            List<TeamPlayer> teamPlayers = new List<TeamPlayer>();

            // for each players, we choose randomly a team
            foreach (Player player in players)
            {
                // picking a team randomly from the list of teams and add to the player
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
            leagueInCreation.TeamPlayers = teamPlayers;

            return leagueInCreation;


        }
        

        
        // Get the list of the teams associated to the country Id
        private async Task<IEnumerable<Team>> getTeamsAssociatedToTheCountry(int countryId){
            TeamFilter teamFilter = new TeamFilter();
            teamFilter.CountryId = countryId;
            return await this.teamRepository.GetAllWithFilter(teamFilter);
        }


        /**
         * Method verifying if a country exist in the item
         **/
        private async Task<bool> isCountryExist(int CountryId)
        {
            Country country = await this.countryRepository.Get(CountryId);
            return (country != null);
        }

        /**
         * Creating an error message indicating that the country doesn't exist
         **/
        private const string countryDoesntExistsError = "The country doesn't exist";
        private HttpResponseMessage createErrorResponseCountryDoesntExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, countryDoesntExistsError);
        }
        
        /**
         * Creating an error message indicating that the season name already exists for this country
         **/
        private const string seasonNameExistsError = "The season name already exists for this country";
        private HttpResponseMessage createErrorResponseSeasonNameExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, seasonNameExistsError);
        }



    }
}
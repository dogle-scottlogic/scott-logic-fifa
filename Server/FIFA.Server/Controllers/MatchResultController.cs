using FIFA.Server.Authentication;
using FIFA.Server.Infrastructure;
using FIFA.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using FIFA.Server.Models.Authentication;

namespace FIFA.Server.Controllers
{
    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require authenticated requests.
    [ConfigurableCorsPolicy("localhost")]
    public class MatchResultController : ApiController
    {
        IMatchRepository matchRepository;
        IScoreRepository scoreRepository;
        ICurrentUserTool userTool;

        public MatchResultController(IMatchRepository matchRepository, IScoreRepository scoreRepository, ICurrentUserTool _userTool) {
            this.matchRepository = matchRepository;
            this.scoreRepository = scoreRepository;
            this.userTool = _userTool;
        }
                public async Task<HttpResponseMessage> Post(MatchResultDTO matchResult) { 

            if (matchResult != null)
            {
                // create a score for home and one for away
                // first, get the match ID
                Match match = await matchRepository.GetMatchByPlayers(matchResult.HomePlayerId, matchResult.AwayPlayerId);

                if (match != null)
                {
                    // if we found the match, we verify if it has already been played, if it s the case,
                    // only the admin can change the value then
                    if (match.Played
                        && !this.userTool.isUserInRole(AuthenticationRoles.AdministratorRole))
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Only the administrator can modify a match already played.");
                    }

                    // found the match, now update the scores and save them
                    Score homeScore = new Score();
                    homeScore.MatchId = match.Id;
                    homeScore.TeamPlayerId = matchResult.HomePlayerId;
                    homeScore.Location = Location.Home;
                    homeScore.Goals = matchResult.ScoreHome;
                    var resultUpdateHome = await scoreRepository.UpdateFromMatchResult(homeScore);

                    Score awayScore = new Score();
                    awayScore.MatchId = match.Id;
                    awayScore.TeamPlayerId = matchResult.AwayPlayerId;
                    awayScore.Location = Location.Away;
                    awayScore.Goals = matchResult.ScoreAway;
                    var resultUpdateAway = await scoreRepository.UpdateFromMatchResult(awayScore);

                    if (resultUpdateHome && resultUpdateAway)
                    {
                        // also set the match to 'played'
                        match.Played = true;
                        match.Date = matchResult.Date;

                        await matchRepository.Update(match.Id, match);
                    }
                    else {
                        return createErrorResponseWithMessage("There was a problem adding the score");
                    }
                    
                }
                else {
                    return createErrorResponseWithMessage("There is no match with this criteria");
                }
            }
            else {
                return createErrorResponseWithMessage("Result is empty");   
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        private HttpResponseMessage createErrorResponseWithMessage(String msg){
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, msg);
        }
    }
}

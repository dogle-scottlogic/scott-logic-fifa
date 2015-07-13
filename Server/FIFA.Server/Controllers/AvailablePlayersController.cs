using FIFA.Server.Infrastructure;
using FIFA.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace FIFA.Server.Controllers
{
    [ConfigurableCorsPolicy("localhost")]
    public class AvailablePlayersController : ApiController
    {
        ITeamPlayerRepository teamPlayerRepo;

        public AvailablePlayersController(ITeamPlayerRepository teamPlayerRepo) {
            this.teamPlayerRepo = teamPlayerRepo;
        }

        // GET api/AvailablePlayers
        [ResponseType(typeof(IEnumerable<TeamPlayer>))]
        public async Task<HttpResponseMessage> GetAvailablePlayers(int? id = null)
        {
            IEnumerable<TeamPlayer> list; 
            if (id == null) { 
                //when no id specified, get all the available players for a home game
                list = await teamPlayerRepo.GetAllWithUnplayedMatches(Location.Home); 
            } else {
                // if we get an id argument, we need to retrieve the available players 
                // that still have unplayed matched with player with Id = id
                list = await teamPlayerRepo.GetAvailableAwayOpponents(id.Value);
            }
            
            return Request.CreateResponse(HttpStatusCode.OK, list);
        }
    }
}

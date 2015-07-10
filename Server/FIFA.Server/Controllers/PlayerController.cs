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

    [ConfigurableCorsPolicy("localhost")]
    public class PlayerController : AbstractCRUDAPIController<Player, int, PlayerFilter>
    {
        private FIFAServerContext db = new FIFAServerContext();
        
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public PlayerController(IPlayerRepository playerRepository)
            : base(playerRepository)
        {
        }

        /// <summary>
        ///     Retrieve a list of players
        /// </summary>
        /// <returns>Return a list of playerModel</returns>
        /// 
        // GET api/Player
        [ResponseType(typeof(IEnumerable<Player>))]
        public async Task<HttpResponseMessage> GetAll([FromUri] PlayerFilter playerFilter = null)
        {
            IEnumerable<Player> list;

            if (playerFilter == null)
            {
                list = await base.repository.GetAll();
            }
            else
            {
                list = await base.repository.GetAllWithFilter(playerFilter);
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        /// <summary>
        ///     Retrieves a specific player by it's ID
        /// </summary>
        /// <param name="id">The ID of the player.</param>
        /// <returns>Return a playerModel if found</returns>
        /// 
        // GET api/Player/5
        [ResponseType(typeof(Player))]
        public async Task<HttpResponseMessage> Get(int id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new player
        /// </summary>
        /// <param name="item">The player to add without id</param>
        /// <returns>Return a playerModel if created and its uri to retrieve it</returns>
        /// 
        // POST api/Country
        [ResponseType(typeof(Player))]
        public async Task<HttpResponseMessage> Post(Player item)
        {
            if (item != null && await ((IPlayerRepository)repository).isPlayerNameExist(item.Name, null))
            {
                return this.createErrorResponsePlayerNameExists();
            }
            else
            {
                return await base.Post(item);
            }
        }

        /// <summary>
        ///     Update a player by its ID
        /// </summary>
        /// <param name="id">The ID of the player.</param>
        /// <param name="item">The modified player</param>
        /// <returns>Return the modified playerModel if no error</returns>
        /// 
        // PUT api/Player/5
        [ResponseType(typeof(Player))]
        public async Task<HttpResponseMessage> Put(int id, Player item)
        {
            if (await ((IPlayerRepository)repository).isPlayerNameExist(item.Name, id))
            {
                return this.createErrorResponsePlayerNameExists();
            }
            else
            {
                return await base.Put(id, item);
            }
        }

        /// <summary>
        ///     Delete a Player by its ID
        /// </summary>
        /// <param name="id">The ID of the Player.</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with player not found message)
        /// </returns>
        /// 
        // DELETE api/Player/5
        [ResponseType(typeof(Player))]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            return await base.Delete(id);
        }

        /**
         * Creating an error message indicating that the player name already exists
         **/
        private const string playerNameExistsError = "The player name already exists";
        private HttpResponseMessage createErrorResponsePlayerNameExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, playerNameExistsError);
        }

    }
}
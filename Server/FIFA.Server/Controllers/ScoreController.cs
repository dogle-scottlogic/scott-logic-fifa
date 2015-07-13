using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using FIFA.Server.Models;

namespace FIFA.Server.Controllers
{
    public class ScoreController : AbstractCRUDAPIController<Score, int, ScoreFilter>
    {
        private FIFAServerContext db = new FIFAServerContext();

        public ScoreController(IScoreRepository repository) : base(repository) { }

        /// <summary>
        ///     Retrieve a list of scores
        /// </summary>
        /// <returns>Return a list of score models</returns>
        /// 
        // GET api/Score
        [ResponseType(typeof(IEnumerable<Score>))]
        public async Task<HttpResponseMessage> GetAll([FromUri] ScoreFilter filter = null)
        {
            IEnumerable<Score> list;

            if (filter == null)
            {
                list = await base.repository.GetAll();
            }
            else
            {
                list = await base.repository.GetAllWithFilter(filter);
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        /// <summary>
        ///     Retrieves a specific score by its ID
        /// </summary>
        /// <param name="id">The ID of the score.</param>
        /// <returns>Return a score model if found</returns>
        /// 
        // GET api/Score/5
        [ResponseType(typeof(Score))]
        public async Task<HttpResponseMessage> Get(int id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new score
        /// </summary>
        /// <param name="item">The score to add without id</param>
        /// <returns>Return a Score model if created and its uri to retrieve it</returns>
        /// 
        // POST api/Score
        [ResponseType(typeof(Score))]
        public async Task<HttpResponseMessage> Post(Score item)
        {
            if (item != null && ScoreExists(item.Id))
            {
                return this.createErrorScoreExists();
            }
            else
            {
                return await base.Post(item);
            }
        }

        /// <summary>
        ///     Update a Score by its ID
        /// </summary>
        /// <param name="id">The ID of the Score.</param>
        /// <param name="item">The modified Score</param>
        /// <returns>Return the modified Score if no error</returns>
        /// 
        // PUT api/Score/5
        [ResponseType(typeof(Score))]
        public async Task<HttpResponseMessage> Put(int id, Score item)
        {
            if (item != null && ScoreExists(item.Id))
            {
                return this.createErrorScoreExists();
            }
            else
            {
                return await base.Put(id, item);
            }
        }

        /// <summary>
        ///     Delete a Score by its ID
        /// </summary>
        /// <param name="id">The ID of the Score.</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with Score not found message)
        /// </returns>
        /// 
        // DELETE api/Score/5
        [ResponseType(typeof(Score))]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            return await base.Delete(id);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ScoreExists(int id)
        {
            return db.Scores.Count(e => e.Id == id) > 0;
        }

        /**
         * Creating an error message indicating that the Score with the id already exists in DB
         **/
        private const string scoreExistsError = "The score id already exists";
        private HttpResponseMessage createErrorScoreExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, scoreExistsError);
        }
    }
}
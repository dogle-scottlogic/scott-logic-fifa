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

    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require authenticated requests.
    [ConfigurableCorsPolicy("localhost")]
    public class SeasonViewController : ApiController
    {
        private FIFAServerContext db = new FIFAServerContext();

        ISeasonRepository seasonRepository;
        ILeagueRepository leagueRepository;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public SeasonViewController(ISeasonRepository seasonRepository, ILeagueRepository leagueRepository)
            : base()
        {
            this.seasonRepository = seasonRepository;
            this.leagueRepository = leagueRepository;
        }


        /// <summary>
        ///     Retrieves a specific season by it's ID
        /// </summary>
        /// <param name="id">The ID of the season.</param>
        /// <returns>Return a seasonModel if found</returns>
        /// 
        // GET api/SeasonView/5
        [ResponseType(typeof(SeasonViewModel))]
        public async Task<HttpResponseMessage> Get(int id)
        {

            Season season = await this.seasonRepository.Get(id);

            if (season == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            else
            {
                SeasonViewModel sVM = new SeasonViewModel();
                sVM.Id = season.Id;
                sVM.Name = season.Name;
                List<LeagueViewModel> leagueViewModel = new List<LeagueViewModel>();

                // Get all the leagues attached to the season
                LeagueFilter lf = new LeagueFilter();
                lf.SeasonId = season.Id;

                IEnumerable<League> leagues = await this.leagueRepository.GetAllWithFilter(lf);

                if (leagues != null)
                {
                    foreach (League league in leagues)
                    {
                        leagueViewModel.Add(await this.leagueRepository.GetViewModel(league.Id));
                    }
                }
                sVM.LeagueViewModels = leagueViewModel;

                return Request.CreateResponse(HttpStatusCode.OK, sVM);
            }

        }


    }
}
    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Moq;
using System.Web.Http.Results;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections;
using System.Net.Http;
using System.Web.Routing;
using System.Web;
using System.Web.Http;
using System.Web.Http.Routing;
using System.Web.Http.Controllers;
using System.Web.Http.Hosting;
using System.Net;
using FIFA.Server.Models;
using FIFA.Server.Controllers;

namespace FIFATests.ControllerTests
{
    [TestClass]
        public class seasonViewControllerTests : AbstractControllerTest
    {

        public List<Season> CreateSeasonList()
        {
            var seasons = new List<Season>
            {
                new Season{Id=1, Name="Season 1", 
                    Leagues= new List<League>{new League{Id= 1, Name="A"},
                                              new League{Id= 2, Name="B"}
                                                           }},
                new Season{Id=2, Name="Season 2", 
                    Leagues= new List<League>{new League{Id= 3, Name="C"},
                                              new League{Id= 4, Name="D"}
                                                           }},
                new Season{Id=3, Name="Season 3", 
                    Leagues= new List<League>{new League{Id= 5, Name="E"},
                                              new League{Id= 6, Name="F"}
                                                           }}
            };
            return seasons;
        }

        // Method used to generate a season view list from a season list
        public List<SeasonViewModel> CreateSeasonViewListFromSeasonList(List<Season> seasons)
        {
            var seasonViews = new List<SeasonViewModel>();
            foreach (Season season in seasons)
            {
                SeasonViewModel svm = new SeasonViewModel { Id = season.Id, Name = season.Name };
                List<LeagueViewModel> lvmList = new List<LeagueViewModel>();
                foreach (League league in season.Leagues)
                {
                    LeagueViewModel lvm = new LeagueViewModel { Id = league.Id, Name = league.Name };
                    lvmList.Add(lvm);
                }
                svm.LeagueViewModels = lvmList;
                seasonViews.Add(svm);
            }

            return seasonViews;

        }


        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveASeasonViewInTheRepo()
        {
            List<Season> seasons = CreateSeasonList();
            List<SeasonViewModel> seasonView = CreateSeasonViewListFromSeasonList(seasons);

            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(seasons.FirstOrDefault(s => s.Id == id)));

            var mockLeagueRepo = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mockLeagueRepo.As<ILeagueRepository>().Setup(m => m.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns<LeagueFilter>(l => Task.FromResult((IEnumerable<League>)seasons.FirstOrDefault(s => s.Id == l.SeasonId).Leagues));
            
            // We get the leagues from the league list
            mockLeagueRepo.As<ILeagueRepository>().Setup(m => m.GetViewModel(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(seasonView[0].LeagueViewModels.FirstOrDefault(l => l.Id == id)));


            // Creating the controller which we want to create
            SeasonViewController controller = new SeasonViewController(mock.Object, mockLeagueRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            // we should retrieve the season view 0
            Assert.AreEqual(seasonView[0].Name, ((SeasonViewModel)objectContent.Value).Name);
            Assert.AreEqual(seasonView[0].LeagueViewModels.Count(), ((SeasonViewModel)objectContent.Value).LeagueViewModels.Count());


        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveFailureASeasonInTheRepo()
        {
            List<Season> seasons = CreateSeasonList();
            Season season = new Season();
            season.Id = 1;

            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult((Season)null));

            var mockLeagueRepo = new Mock<ILeagueRepository>(MockBehavior.Strict);


            // Creating the controller which we want to create
            SeasonViewController controller = new SeasonViewController(mock.Object, mockLeagueRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);

        }

    }


}
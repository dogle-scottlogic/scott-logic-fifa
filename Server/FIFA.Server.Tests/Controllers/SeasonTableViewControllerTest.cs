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
        public class seasonTableViewControllerTests : AbstractControllerTest
    {

        public List<SeasonTableViewModel> CreateSeasonList()
        {
            var seasons = new List<SeasonTableViewModel>
            {
                new SeasonTableViewModel{Id=1, Name="Season 1", 
                    LeagueTables= new List<LeagueTableViewModel>{new LeagueTableViewModel{Id= 1, Name="A"},
                                              new LeagueTableViewModel{Id= 2, Name="B"}
                                                           }},
                new SeasonTableViewModel{Id=2, Name="Season 2", 
                    LeagueTables= new List<LeagueTableViewModel>{new LeagueTableViewModel{Id= 3, Name="C"},
                                              new LeagueTableViewModel{Id= 4, Name="D"}
                                                           }},
                new SeasonTableViewModel{Id=3, Name="Season 3", 
                    LeagueTables= new List<LeagueTableViewModel>{new LeagueTableViewModel{Id= 5, Name="E"},
                                              new LeagueTableViewModel{Id= 6, Name="F"}
                                                           }}
            };
            return seasons;
        }



        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveASeasonViewInTheRepo()
        {
            List<SeasonTableViewModel> seasonView = CreateSeasonList();

            var mock = new Mock<ISeasonTableViewRepository>(MockBehavior.Strict);
            mock.As<ISeasonTableViewRepository>().Setup(m => m.GetAll())
                .Returns(Task.FromResult((IEnumerable<SeasonTableViewModel>)seasonView));


            // Creating the controller which we want to create
            SeasonTableViewController controller = new SeasonTableViewController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            // we should retrieve the season view 0
            Assert.AreEqual(seasonView, (IEnumerable<SeasonTableViewModel>)objectContent.Value);
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);


        }

        // Verifying if we retrieve nothing in the repo that the response is still ok
        [TestMethod]
        public void RetrieveNothingForTheSeasonInTheRepo()
        {
            var mock = new Mock<ISeasonTableViewRepository>(MockBehavior.Strict);
            mock.As<ISeasonTableViewRepository>().Setup(m => m.GetAll())
                .Returns(Task.FromResult((IEnumerable<SeasonTableViewModel>)null));


            // Creating the controller which we want to create
            SeasonTableViewController controller = new SeasonTableViewController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);

        }

    }


}
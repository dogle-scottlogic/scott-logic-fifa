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
    public class leagueControllerTests
    {

        public static void fakeContext(ApiController controller)
        {
            // arrange
            var config = new HttpConfiguration();
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/League");
            var route = config.Routes.MapHttpRoute("defaultAPI", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary(new { controller = "product" }));
            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Url = new UrlHelper(request);
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            controller.Request.Properties[HttpPropertyKeys.HttpRouteDataKey] = routeData;
        }

        // Method used to generate a league list
        public List<League> CreateLeagueList()
        {

            var leagues = new List<League>
        {
            new League{Id=1,SeasonId=1, Name="Serie A"},
            new League{Id=2,SeasonId=1, Name="Ligue 1"},
            new League{Id=3,SeasonId=1, Name="La Liga"}
        };

            return leagues;
        }


        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveALeagueInTheRepo()
        {
            List<League> leagues = CreateLeagueList();

            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(leagues.FirstOrDefault(c => c.Id == id)));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(leagues[0], objectContent.Value);


        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveFailureALeagueInTheRepo()
        {
            List<League> leagues = CreateLeagueList();

            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int?>(id => Task.FromResult(leagues.FirstOrDefault(c => false)));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);

        }

        // Verifying the getAll method
        [TestMethod]
        public void RetrieveAllleaguesInTheRepo()
        {
            IEnumerable<League> leagues = CreateLeagueList();

            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.GetAll())
                .Returns(Task.FromResult(leagues));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(leagues, objectContent.Value);

        }


        // Verifying the Add method
        [TestMethod]
        public void AddLeagueInTheRepo()
        {
            List<League> leagues = CreateLeagueList();
            List<League> added = new List<League>();
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Add(It.IsAny<League>()))
                .Returns(Task.FromResult(leagues.FirstOrDefault()))
                .Callback<League>(c => added.Add(c));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), null))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Testing all the list that we can retrieve correctly the leagues
            for (int i = 0; i < leagues.Count; i++)
            {
                HttpResponseMessage response = controller.Post(leagues[i]).Result;
                // the result should say "HttpStatusCode.Created"
                Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
            }

            // the added list should be the same as the list
            CollectionAssert.AreEqual(leagues, added);
        }


        // Verifying the Add method fail if the season is unknown
        [TestMethod]
        public void AddfailureLeagueSeasonUnknownInTheRepo()
        {
            League league = new League();
            List<League> added = new List<League>();
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Add(It.IsAny<League>()));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult((Season)null));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(league).Result;
            // the result should say "HttpStatusCode.Created"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureLeagueInTheRepo()
        {
            League league = new League();
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Add(It.IsAny<League>()));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(0, null, null))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(league).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNullLeagueInTheRepo()
        {
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Add(It.IsAny<League>()));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure exist name in the repo
        [TestMethod]
        public void AddFailureLeagueNameExistsInTheRepo()
        {
            League league = new League();
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Add(It.IsAny<League>()));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), null))
                .Returns(Task.FromResult(true));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(league).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }

                        
        // Verifying the Update failure method
        [TestMethod]
        public void UpdateLeagueInTheRepo()
        {
            League league = new League();

            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<League>()))
                .Returns(Task.FromResult(true));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            League modifiedleague = new League();
            modifiedleague.Id = league.Id;
            modifiedleague.Name = "ModifiedName";
            HttpResponseMessage response = controller.Put(modifiedleague.Id, modifiedleague).Result;
            // the result should say "HttpStatusCode.Created" and the returned object should have a different lastName
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);

            var objectContent = response.Content as ObjectContent;
            Assert.AreNotEqual(league.Name, ((League)objectContent.Value).Name);

        }


        // Verifying the update method fail if the season is unknown
        [TestMethod]
        public void UpdatefailureLeagueSeasonUnknownInTheRepo()
        {
            League league = new League();
            List<League> added = new List<League>();
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<League>()));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult((Season)null));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(league.Id, league).Result;
            // the result should say "HttpStatusCode.Created"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureLeagueInTheRepo()
        {
            League league = new League();

            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<League>()))
                .Returns(Task.FromResult(true));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Put(league.Id, league).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureNullLeagueInTheRepo()
        {
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<League>()))
                .Returns(Task.FromResult(true));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(1,null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure exist name in the repo
        [TestMethod]
        public void UpdateFailureLeagueNameExistsInTheRepo()
        {
            League league = new League();
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Add(It.IsAny<League>()));
            mock.As<ILeagueRepository>().Setup(m => m.isLeagueNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(1, league).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteLeagueInTheRepo()
        {
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.OK"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteFailureLeagueInTheRepo()
        {
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Season()));

            // Creating the controller which we want to create
            LeagueController controller = new LeagueController(mock.Object, mockSeasonRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.NotFound"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);
        }


    }


}
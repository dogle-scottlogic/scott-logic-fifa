using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net.Http;
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
    public class playerControllerTests
    {

        public static void fakeContext(ApiController controller)
        {
            // arrange
            var config = new HttpConfiguration();
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/Player");
            var route = config.Routes.MapHttpRoute("defaultAPI", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary(new { controller = "product" }));
            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Url = new UrlHelper(request);
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            controller.Request.Properties[HttpPropertyKeys.HttpRouteDataKey] = routeData;
        }

        // Method used to generate a player list
        public List<Player> CreatePlayerList()
        {

            var players = new List<Player>
            {
                new Player { Id=1, Name="Anda Popovici" },
                new Player { Id=2, Name="Steven Savery" },
                new Player { Id=3, Name="Fabien Pozzobon" }
            };

            return players;
        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveAPlayerInTheRepo()
        {
            List<Player> players = CreatePlayerList();

            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(players.FirstOrDefault(c => c.Id == id)));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(players[0], objectContent.Value);


        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveFailureAPlayerInTheRepo()
        {
            List<Player> players = CreatePlayerList();

            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int?>(id => Task.FromResult(players.FirstOrDefault(c => false)));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);

        }

        // Verifying the getAll method
        [TestMethod]
        public void RetrieveAllPlayersInTheRepo()
        {
            IEnumerable<Player> players = CreatePlayerList();

            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.GetAll())
                .Returns(Task.FromResult(players));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(players, objectContent.Value);

        }


        // Verifying the Add method
        [TestMethod]
        public void AddPlayerInTheRepo()
        {
            List<Player> players = CreatePlayerList();
            List<Player> added = new List<Player>();
            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Add(It.IsAny<Player>()))
                .Returns(Task.FromResult(players.FirstOrDefault()))
                .Callback<Player>(c => added.Add(c));

            mock.As<IPlayerRepository>().Setup(m => m.isPlayerNameExist(It.IsAny<string>(), null))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Testing all the list that we can retrieve correctly the players
            for (int i = 0; i < players.Count; i++)
            {
                HttpResponseMessage response = controller.Post(players[i]).Result;
                // the result should say "HttpStatusCode.Created"
                Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
            }

            // the added list should be the same as the list
            CollectionAssert.AreEqual(players, added);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailurePlayerInTheRepo()
        {
            Player player = new Player();
            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Add(It.IsAny<Player>()));

            mock.As<IPlayerRepository>().Setup(m => m.isPlayerNameExist(It.IsAny<string>(), null))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(player).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNameExistsPlayerInTheRepo()
        {
            Player player = new Player();
            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Add(It.IsAny<Player>()));
            // Setting up that the player name already exist
            mock.As<IPlayerRepository>().Setup(m => m.isPlayerNameExist(null, null))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(player).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNullPlayerInTheRepo()
        {
            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Add(It.IsAny<Player>()));

            mock.As<IPlayerRepository>().Setup(m => m.isPlayerNameExist(It.IsAny<string>(), null))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


                        
        // Verifying the Update failure method
        [TestMethod]
        public void UpdatePlayerInTheRepo()
        {
            Player player = new Player();

            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Player>()))
                .Returns(Task.FromResult(true));

            mock.As<IPlayerRepository>().Setup(m => m.isPlayerNameExist(It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            Player modifiedplayer = new Player();
            modifiedplayer.Id = player.Id;
            modifiedplayer.Name = "ModifiedName";
            HttpResponseMessage response = controller.Put(modifiedplayer.Id, modifiedplayer).Result;
            // the result should say "HttpStatusCode.Created" and the returned object should have a different lastName
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);

            var objectContent = response.Content as ObjectContent;
            Assert.AreNotEqual(player.Name, ((Player)objectContent.Value).Name);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailurePlayerInTheRepo()
        {
            Player player = new Player();

            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Player>()))
                .Returns(Task.FromResult(true));
            mock.As<IPlayerRepository>().Setup(m => m.isPlayerNameExist(null, null))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(player).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureNullPlayerInTheRepo()
        {
            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Player>()))
                .Returns(Task.FromResult(true));
            mock.As<IPlayerRepository>().Setup(m => m.isPlayerNameExist(It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method if player exists
        [TestMethod]
        public void UpdateFailurePlayerNameExistsInTheRepo()
        {
            Player player = new Player();
            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Player>()))
                .Returns(Task.FromResult(true));
            mock.As<IPlayerRepository>().Setup(m => m.isPlayerNameExist(null, null))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(player).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the delete method
        [TestMethod]
        public void DeletePlayerInTheRepo()
        {
            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteFailurePlayerInTheRepo()
        {
            var mock = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            PlayerController controller = new PlayerController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.NotFound"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);
        }


    }


}
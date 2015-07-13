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
        public class generateLeagueControllerTests : AbstractControllerTest
    {
        // Method used to generate a country list
        public List<League> CreateLeagueList()
        {

            var leagues = new List<League>
            {
                new League{Id=1,Name="League 1", SeasonId=1},
                new League{Id=2,Name="League 2", SeasonId=1},
                new League{Id=3,Name="League 1", SeasonId=2}
            };

            return leagues;
        }
     

        // Verifying the Generate failure method
        [TestMethod]
        public void GenerateFailureNullLeagueInTheRepo()
        {
            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            var mockTeamPlayerRepo = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            var mockPlayerRepo = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockTeamPlayerRepo.Object, mockPlayerRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Generate failure if the season doesn't exists
        [TestMethod]
        public void GenerateFailureSeasonDoesntExistsInTheRepo()
        {
            League league = CreateLeagueList()[0];
            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult((Season)null));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            var mockTeamPlayerRepo = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            var mockPlayerRepo = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockTeamPlayerRepo.Object, mockPlayerRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(league).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Generate failure if the league already exists
        [TestMethod]
        public void GenerateFailureLeagueExistsInTheRepo()
        {
            IEnumerable<League> leagues = CreateLeagueList();
            League league = leagues.ElementAt(0);

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult(leagues));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));
            
            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            var mockTeamPlayerRepo = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            var mockPlayerRepo = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockTeamPlayerRepo.Object, mockPlayerRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(league).Result; 
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"Creation impossible some leagues already exists for this season\"}");

        }

        // Verifying the Generate failure if we have less than 4 players
        [TestMethod]
        public void GenerateFailureLeagueLessThanFourPlayers()
        {
            IEnumerable<League> leagues = CreateLeagueList();
            League league = new League();
            league.Players = new List<Player>();
            for (int i = 0; i < 3; i++)
            {
                league.Players.Add(new Player());
            }

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult((IEnumerable<League>)null));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)new List<Team>()));
            

            var mockTeamPlayerRepo = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            var mockPlayerRepo = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockTeamPlayerRepo.Object, mockPlayerRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(league).Result; 
            
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"You must choose at least 4 players.\"}");

        }

        // Verifying the Generate failure if we have an even number of players
        [TestMethod]
        public void GenerateFailureLeagueNotEvenPlayers()
        {
            IEnumerable<League> leagues = CreateLeagueList();
            League league = new League();
            league.Players = new List<Player>();
            for (int i = 0; i < 5; i++)
            {
                league.Players.Add(new Player());
            }

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult((IEnumerable<League>)null));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)new List<Team>()));


            var mockTeamPlayerRepo = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            var mockPlayerRepo = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockTeamPlayerRepo.Object, mockPlayerRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(league).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"You must choose an even number of players.\"}");

        }

        // Verifying the Generate failure if we have not enough team for players
        [TestMethod]
        public void GenerateFailureNotEnoughTeamForPlayers()
        {
            IEnumerable<League> leagues = CreateLeagueList();
            League league = new League();
            league.Players = new List<Player>();
            for (int i = 0; i < 4; i++)
            {
                league.Players.Add(new Player());
            }

            List<Team> teams = new List<Team>();
            for (int i = 0; i < 3; i++)
            {
                teams.Add(new Team());
            }

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult((IEnumerable<League>)null));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));
            

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)new List<Team>()));

            var mockTeamPlayerRepo = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            var mockPlayerRepo = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockTeamPlayerRepo.Object, mockPlayerRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(league).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"Not enough team exists for this country.\"}");
        }

        // Verifying the Generate failure if the model state is not valid
        [TestMethod]
        public void GenerateFailureIfModelStateNotValid()
        {
            IEnumerable<League> leagues = CreateLeagueList();
            League league = new League();
            league.Players = new List<Player>();
            for (int i = 0; i < 4; i++)
            {
                league.Players.Add(new Player());
            }

            List<Team> teams = new List<Team>();
            for (int i = 0; i < 8; i++)
            {
                teams.Add(new Team());
            }

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult((IEnumerable<League>)null));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));


            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)teams));

            var mockTeamPlayerRepo = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            var mockPlayerRepo = new Mock<IPlayerRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockTeamPlayerRepo.Object, mockPlayerRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(league).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"The request is invalid.\",\"ModelState\":{\"key\":[\"errorMessage\"]}}");
        }

        // Verifying the Generate valide if all is ok
        [TestMethod]
        public void GenerateLeagueValid()
        {
            IEnumerable<League> leagues = CreateLeagueList();
            League league = new League();
            league.Players = new List<Player>();
            for (int i = 0; i < 4; i++)
            {
                league.Players.Add(new Player());
            }

            List<Team> teams = new List<Team>();
            for (int i = 0; i < 8; i++)
            {
                teams.Add(new Team());
            }

            Season season = new Season();
            Player player = new Player();

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult((IEnumerable<League>)null));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));


            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)teams));
            
            // Mocking the creation of the league createLeagueAttachedToPlayers
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.Add(It.IsAny<League>()))
                .Returns(Task.FromResult(league));
            var mockPlayerRepo = new Mock<IPlayerRepository>(MockBehavior.Strict);
            mockPlayerRepo.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(l => l.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(player));
            mockPlayerRepo.As<ICRUDRepository<Player, int, PlayerFilter>>().Setup(l => l.Update(It.IsAny<int>(), It.IsAny<Player>()))
                .Returns(Task.FromResult(true));
            
            var mockTeamPlayerRepo = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            var teamPlayer = new TeamPlayer();
            // Mocking the createTeamAttachedToSeason
            mockTeamPlayerRepo.As<ICRUDRepository<TeamPlayer, int, TeamPlayerFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<TeamPlayerFilter>()))
                .Returns(Task.FromResult((IEnumerable<TeamPlayer>)null));
            mockTeamPlayerRepo.As<ICRUDRepository<TeamPlayer, int, TeamPlayerFilter>>().Setup(l => l.Add(It.IsAny<TeamPlayer>()))
                .Returns(Task.FromResult(teamPlayer));
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Update(It.IsAny<int>(), It.IsAny<Season>()))
                .Returns(Task.FromResult(true));
            
            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockTeamPlayerRepo.Object, mockPlayerRepo.Object);


            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(league).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
        }


    }


}
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

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);

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
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult((Season)null));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"The season doesn't exist\"}");
        }

        // Verifying the Generate failure if the league already exists
        [TestMethod]
        public void GenerateFailureLeagueExistsInTheRepo()
        {
            IEnumerable<League> leagues = CreateLeagueList();
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult(leagues));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));
            
            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result; 
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"Creation impossible some leagues already exists for this season\"}");

        }

        // Verifying the Generate failure if we have less than 4 players
        [TestMethod]
        public void GenerateFailureLeagueLessThanFourPlayers()
        {
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.Players = new List<Player>();
            for (int i = 0; i < 3; i++)
            {
                generateLeagueDTO.Players.Add(new Player());
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
            
            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result; 
            
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"You must choose at least 4 players.\"}");

        }

        // Verifying the Generate failure if we have an even number of players
        [TestMethod]
        public void GenerateFailureLeagueNotEvenPlayers()
        {
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.Players = new List<Player>();
            for (int i = 0; i < 5; i++)
            {
                generateLeagueDTO.Players.Add(new Player());
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
            
            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"You must choose an even number of players.\"}");

        }

        // Verifying the Generate failure if we have not enough team for players
        [TestMethod]
        public void GenerateFailureNotEnoughTeamForPlayers()
        {
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.Players = new List<Player>();
            for (int i = 0; i < 4; i++)
            {
                generateLeagueDTO.Players.Add(new Player());
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

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"Not enough team exists for this country.\"}");
        }

        // Verifying the Generate failure if the model state is not valid
        [TestMethod]
        public void GenerateFailureIfModelStateNotValid()
        {
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.Players = new List<Player>();
            for (int i = 0; i < 4; i++)
            {
                generateLeagueDTO.Players.Add(new Player());
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

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"The request is invalid.\",\"ModelState\":{\"key\":[\"errorMessage\"]}}");
        }

        // Verifying the Generate valide if all is ok - Case players without team
        [TestMethod]
        public void GenerateLeagueValidPlayersWithoutTeam()
        {
            League league = new League();

            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.Players = new List<Player>();
            for (int i = 0; i < 4; i++)
            {
                generateLeagueDTO.Players.Add(new Player());
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
            mock.As<ILeagueRepository>().Setup(l => l.createLeagueWithTeamPlayers(It.IsAny<League>(),
                It.IsAny<List<TeamPlayer>>()))
                .Returns(Task.FromResult(league));
            

            // mocking the answer
            mock.As<ILeagueRepository>().Setup(l => l.GetViewModel(It.IsAny<int>()))
                .Returns(Task.FromResult(new LeagueViewModel()));
            
            
            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);


            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            // the result should say "HttpStatusCode.Created"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
        }

        // Verifying the Generate valide if all is ok - Case players with existing team
        [TestMethod]
        public void GenerateLeagueValidPlayersWithTeam()
        {
            League league = new League();

            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.Players = new List<Player>();
            for (int i = 0; i < 4; i++)
            {
                generateLeagueDTO.Players.Add(new Player());
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

            // Mocking the creation of the league createLeagueAttachedToPlayers
            mock.As<ILeagueRepository>().Setup(l => l.createLeagueWithTeamPlayers(It.IsAny<League>(),
                It.IsAny<List<TeamPlayer>>()))
                .Returns(Task.FromResult(league));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));


            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)teams));


            // mocking the answer
            mock.As<ILeagueRepository>().Setup(l => l.GetViewModel(It.IsAny<int>()))
                .Returns(Task.FromResult(new LeagueViewModel()));

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);


            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            // the result should say "HttpStatusCode.Created"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
        }

        // Verifying the Generate valide if all is ok - Case we have more players that can fit on only one League
        [TestMethod]
        public void GenerateLeagueValidPlayersWithTeamMultipleLeagues()
        {

            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.Players = new List<Player>();
            for (int i = 0; i < 14; i++)
            {
                generateLeagueDTO.Players.Add(new Player());
            }
            List<Team> teams = new List<Team>();
            for (int i = 0; i < 14; i++)
            {
                teams.Add(new Team());
            }


            Season season = new Season();
            Player player = new Player();

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult((IEnumerable<League>)null));

            // Mocking the creation of the league createLeagueAttachedToPlayers
            List<League> createdLeagues = new List<League>();

            // Mocking the creation of the league createLeagueAttachedToPlayers

            mock.As<ILeagueRepository>().Setup(l => l.createLeagueWithTeamPlayers(It.IsAny<League>(),
                It.IsAny<List<TeamPlayer>>()))
                .Callback((League l, List<TeamPlayer> tp) =>
                {
                    l.TeamPlayers = tp;
                    createdLeagues.Add(l);
                })
                .Returns(Task.FromResult(new League()));


            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));


            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)teams));


            // mocking the answer
            mock.As<ILeagueRepository>().Setup(l => l.GetViewModel(It.IsAny<int>()))
                .Returns(Task.FromResult(new LeagueViewModel()));

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object);


            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            // the result should say "HttpStatusCode.Created"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
            // We expect 3 leagues to be created
            Assert.AreEqual(createdLeagues.Count(), 3);
            // With the two first with 4 players
            Assert.AreEqual(createdLeagues.ElementAt(0).TeamPlayers.Count(), 4);
            Assert.AreEqual(createdLeagues.ElementAt(1).TeamPlayers.Count(), 4);
            // and the last with 6 players
            Assert.AreEqual(createdLeagues.ElementAt(2).TeamPlayers.Count(), 6);
        }


    }


}
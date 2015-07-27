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
            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Generate failure if the season doesn't exists
        [TestMethod]
        public void GenerateFailureCountryDoesntExistsInTheRepo()
        {
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult((Country)null));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"The country doesn't exist\"}");
        }

        // Verifying the Generate failure if the league already exists
        [TestMethod]
        public void GenerateFailureSeasonNameExistsInTheRepo()
        {
            IEnumerable<League> leagues = CreateLeagueList();
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult(leagues));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ISeasonRepository>().Setup(s => s.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int?>()))
                .Returns(Task.FromResult(true));

            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult(new Country()));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result; 
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"The season name already exists for this country\"}");

        }

        // Verifying the Generate failure if we have less than 4 players
        [TestMethod]
        public void GenerateFailureLeagueLessThanFourPlayers()
        {
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.PlayerLeagues = new List<PlayerAssignLeagueModel>();
            // We create a list of players
            List<Player> players = new List<Player>();
            for (int i = 0; i < 3; i++)
            {
                players.Add(new Player());
            }
            PlayerAssignLeagueModel playerLeague = new PlayerAssignLeagueModel { league = new League(), Players = players };

            generateLeagueDTO.PlayerLeagues.Add(playerLeague);

            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult((IEnumerable<League>)null));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ISeasonRepository>().Setup(s => s.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int?>()))
                .Returns(Task.FromResult(false));

            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult(new Country()));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)new List<Team>()));

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result; 
            
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"You must choose at least 4 players.\"}");

        }

        // Verifying the Generate failure if a league don't have a name
        [TestMethod]
        public void GenerateFailureLeagueNoName()
        {

            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            generateLeagueDTO.PlayerLeagues = new List<PlayerAssignLeagueModel>();
            // We create a list of players
            List<Player> players = new List<Player>();
            for (int i = 0; i < 5; i++)
            {
                players.Add(new Player());
            }
            generateLeagueDTO.PlayerLeagues.Add(new PlayerAssignLeagueModel { Players = players });


            // Filling mock rull with repository
            var mock = new Mock<ILeagueRepository>(MockBehavior.Strict);
            mock.As<ICRUDRepository<League, int, LeagueFilter>>().Setup(l => l.GetAllWithFilter(It.IsAny<LeagueFilter>()))
                .Returns(Task.FromResult((IEnumerable<League>)null));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ISeasonRepository>().Setup(s => s.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int?>()))
                .Returns(Task.FromResult(false));

            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult(new Country()));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)new List<Team>()));
            
            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            String errorMessage = response.Content.ReadAsStringAsync().Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
            Assert.AreEqual(errorMessage, "{\"Message\":\"All the leagues must have a name.\"}");

        }

        private void  fillPlayerLeagues(GenerateLeagueDTO generateLeagueDTO, int nbPlayers)
        {
            generateLeagueDTO.PlayerLeagues = new List<PlayerAssignLeagueModel>();
            // We create a list of players
            List<Player> players = new List<Player>();
            for (int i = 0; i < nbPlayers; i++)
            {
                players.Add(new Player());
            }
            generateLeagueDTO.PlayerLeagues.Add(new PlayerAssignLeagueModel { league = new League {Name="League 1" }, Players = players });
        }
        

        // Verifying the Generate failure if we have not enough team for players
        [TestMethod]
        public void GenerateFailureNotEnoughTeamForPlayers()
        {
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            fillPlayerLeagues(generateLeagueDTO, 4);

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
            // Setting up that the country name already exist
            mockSeasonRepo.As<ISeasonRepository>().Setup(s => s.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int?>()))
                .Returns(Task.FromResult(false));

            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult(new Country()));

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);

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
            fillPlayerLeagues(generateLeagueDTO, 4);

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
            // Setting up that the country name already exist
            mockSeasonRepo.As<ISeasonRepository>().Setup(s => s.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int?>()))
                .Returns(Task.FromResult(false));

            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult(new Country()));

            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);

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
            fillPlayerLeagues(generateLeagueDTO, 4);
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
            // Setting up that the country name already exist
            mockSeasonRepo.As<ISeasonRepository>().Setup(s => s.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int?>()))
                .Returns(Task.FromResult(false));

            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult(new Country()));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)teams));
            
            // Mocking the creation of the league createLeagueAttachedToPlayers
            mock.As<ILeagueRepository>().Setup(l => l.createSeasonWithLeagues(It.IsAny<Season>(), It.IsAny<List<League>>()))
            .Returns(Task.FromResult(season));


            // mocking the answer
            mock.As<ILeagueRepository>().Setup(l => l.GetViewModel(It.IsAny<int>()))
                .Returns(Task.FromResult(new LeagueViewModel()));
            
            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);


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
            fillPlayerLeagues(generateLeagueDTO, 4);
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
            mock.As<ILeagueRepository>().Setup(l => l.createSeasonWithLeagues(It.IsAny<Season>(), It.IsAny<List<League>>()))
                .Returns(Task.FromResult(season));

            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(s => s.Get(It.IsAny<int>()))
                .Returns(Task.FromResult(new Season()));
            // Setting up that the country name already exist
            mockSeasonRepo.As<ISeasonRepository>().Setup(s => s.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int?>()))
                .Returns(Task.FromResult(false));

            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult(new Country()));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)teams));


            // mocking the answer
            mock.As<ILeagueRepository>().Setup(l => l.GetViewModel(It.IsAny<int>()))
                .Returns(Task.FromResult(new LeagueViewModel()));
            
            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);


            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(generateLeagueDTO).Result;
            // the result should say "HttpStatusCode.Created"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
        }

        // Mocking the valide generation for a determined number of players (return the created leagues)
        private List<League> _initGenerateLeagueValidPlayers(int nbPlayers)
        {
            GenerateLeagueDTO generateLeagueDTO = new GenerateLeagueDTO();
            fillPlayerLeagues(generateLeagueDTO, nbPlayers);
            List<Team> teams = new List<Team>();
            for (int i = 0; i < nbPlayers; i++)
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
            var mockSeasonRepo = new Mock<ISeasonRepository>(MockBehavior.Strict);
            // Setting up that the country name already exist
            mockSeasonRepo.As<ISeasonRepository>().Setup(s => s.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int?>()))
                .Returns(Task.FromResult(false));

            var mockCountry = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountry.As<ICountryRepository>().Setup(c => c.Get(It.IsAny<int>())).Returns(Task.FromResult(new Country()));

            var mockTeamRepo = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Setting up that the teams
            mockTeamRepo.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(s => s.GetAllWithFilter(It.IsAny<TeamFilter>()))
                .Returns(Task.FromResult((IEnumerable<Team>)teams));


            // mocking the answer
            mock.As<ILeagueRepository>().Setup(l => l.GetViewModel(It.IsAny<int>()))
                .Returns(Task.FromResult(new LeagueViewModel()));
            
            // Creating the controller which we want to create
            GenerateLeagueController controller = new GenerateLeagueController(mock.Object, mockSeasonRepo.Object,
                mockTeamRepo.Object, mockCountry.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(nbPlayers, new GenerateLeagueDTO()).Result;

            var objectContent = response.Content as ObjectContent;

            return (List<League>)objectContent.Value;
        }

        // Verifying the Generate valide if all is ok - Case we have more players that can fit on only one League
        [TestMethod]
        public void GenerateLeagueValidPlayersWithTeamMultipleLeagues14()
        {
            List<League> createdLeagues = _initGenerateLeagueValidPlayers(14);
            // We expect 3 leagues to be created
            Assert.AreEqual(createdLeagues.Count(), 3);
        }

        // Verifying the Generate valide if all is ok - Case we have 18 players which means 3 teams of 6 players(not 4)
        [TestMethod]
        public void GenerateLeagueValidPlayersMaxWithTeamMultipleLeagues18()
        {

            List<League> createdLeagues = _initGenerateLeagueValidPlayers(18);
            // We expect 3 leagues to be created
            Assert.AreEqual(createdLeagues.Count(), 3);
        }

        // Verifying the Generate valide if all is ok - Case we have 20 players which means 4 teams of 2*6 and 2*4 players
        [TestMethod]
        public void GenerateLeagueValidPlayersMaxWithTeamMultipleLeagues20()
        {
            List<League> createdLeagues = _initGenerateLeagueValidPlayers(20);
            // We expect 3 leagues to be created
            Assert.AreEqual(createdLeagues.Count(), 4);
        }

        // Verifying the Generate valide if all is ok - Case we have 60 players which means 4 teams of 2*6 and 2*4 players
        [TestMethod]
        public void GenerateLeagueValidPlayersMaxWithTeamMultipleLeagues60()
        {
            List<League> createdLeagues = _initGenerateLeagueValidPlayers(64);
            // We expect 3 leagues to be created
            Assert.AreEqual(createdLeagues.Count(), 11);
        }


    }


}
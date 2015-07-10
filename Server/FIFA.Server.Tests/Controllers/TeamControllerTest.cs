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

namespace FIFATests.ControllerTests {

    [TestClass]
    public class TeamControllerTest : AbstractControllerTest
    {
        public List<Team> createTeams() { 
            
            var teams = new List<Team>
            {
                new Team {Id = 1, Name = "Hamburger SV", CountryId = 1},
                new Team {Id = 2, Name = "Borussia Dortmund", CountryId = 1}
            };

            return teams;
        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveATeamInTheRepo()
        {
            List<Team> teams = createTeams();

            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Filling mock with data
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(teams.FirstOrDefault(c => c.Id == id)));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(teams[0], objectContent.Value);
        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveFailureATeamInTheRepo()
        {
            List<Team> Teams = createTeams();

            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int?>(id => Task.FromResult(Teams.FirstOrDefault(c => false)));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(0).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);
        }

        // Verifying the getAll method
        [TestMethod]
        public void RetrieveAllTeamsInTheRepo()
        {
            IEnumerable<Team> Teams = createTeams();

            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.GetAll())
                .Returns(Task.FromResult(Teams));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(Teams, objectContent.Value);
        }


        // Verifying the Add method
        [TestMethod]
        public void AddTeamInTheRepo()
        {
            List<Team> teams = createTeams();
            List<Team> added = new List<Team>();
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Add(It.IsAny<Team>()))
                .Returns(Task.FromResult(teams.FirstOrDefault()))
                .Callback<Team>(c => added.Add(c));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Testing all the list that we can retrieve correctly the Teams
            for (int i = 0; i < teams.Count; i++)
            {
                HttpResponseMessage response = controller.Post(teams[i]).Result;
                // the result should say "HttpStatusCode.Created"
                Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
            }

            // the added list should be the same as the list
            CollectionAssert.AreEqual(teams, added);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureTeamInTheRepo()
        {
            Team Team = new Team();
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Add(It.IsAny<Team>()));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(Team).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNullTeamInTheRepo()
        {
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Add(It.IsAny<Team>()));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), null))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure exist name in the repo
        [TestMethod]
        public void AddFailureTeamNameExistsInTheRepo()
        {
            Team Team = new Team();
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Add(It.IsAny<Team>()));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(Team).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }

        [TestMethod]
        public void AddFailureCountryNotExistsInTheRepo() {
            Team Team = new Team();
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Filling mock with data
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Add(It.IsAny<Team>()));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult((Country)null));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(Team).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }


        // Verifying the Update failure method
        [TestMethod]
        public void UpdateTeamInTheRepo()
        {
            Team Team = new Team();

            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Team>()))
                .Returns(Task.FromResult(true));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            Team modifiedTeam = new Team();
            modifiedTeam.Id = Team.Id;
            modifiedTeam.Name = "ModifiedName";
            HttpResponseMessage response = controller.Put(modifiedTeam.Id, modifiedTeam).Result;
            // the result should say "HttpStatusCode.Created" and the returned object should have a different lastName
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);

            var objectContent = response.Content as ObjectContent;
            Assert.AreNotEqual(Team.Name, ((Team)objectContent.Value).Name);

        }

        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureTeamInTheRepo()
        {
            Team Team = new Team();

            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Team>()))
                .Returns(Task.FromResult(true));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Put(Team.Id, Team).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureNullTeamInTheRepo()
        {
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Team>()))
                .Returns(Task.FromResult(true));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), null))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(1, null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure exist name in the repo
        [TestMethod]
        public void UpdateFailureTeamNameExistsInTheRepo()
        {
            Team Team = new Team();
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Add(It.IsAny<Team>()));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(1, Team).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }

        [TestMethod]
        public void UpdateFailureCountryNotExistsInTheRepo()
        {
            Team Team = new Team();
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);
            // Filling mock with data
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Add(It.IsAny<Team>()));
            mock.As<ITeamRepository>().Setup(m => m.teamNameExists(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult((Country)null));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(1, Team).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteTeamInTheRepo()
        {
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.OK"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteFailureTeamInTheRepo()
        {
            var mock = new Mock<ITeamRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Team, int, TeamFilter>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, TeamFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            TeamController controller = new TeamController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.NotFound"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);
        }


    }
}

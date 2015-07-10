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
        public class seasonControllerTests : AbstractControllerTest
    {
        // Method used to generate a season list
        public List<Season> CreateSeasonList()
        {

            var seasons = new List<Season>
        {
            new Season{Id=1,CountryId=1, Name="Serie A"},
            new Season{Id=2,CountryId=1, Name="Ligue 1"},
            new Season{Id=3,CountryId=1, Name="La Liga"}
        };

            return seasons;
        }


        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveASeasonInTheRepo()
        {
            List<Season> seasons = CreateSeasonList();

            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(seasons.FirstOrDefault(c => c.Id == id)));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(seasons[0], objectContent.Value);


        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveFailureASeasonInTheRepo()
        {
            List<Season> seasons = CreateSeasonList();

            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int?>(id => Task.FromResult(seasons.FirstOrDefault(c => false)));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);

        }

        // Verifying the getAll method
        [TestMethod]
        public void RetrieveAllseasonsInTheRepo()
        {
            IEnumerable<Season> seasons = CreateSeasonList();

            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.GetAll())
                .Returns(Task.FromResult(seasons));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(seasons, objectContent.Value);

        }


        // Verifying the Add method
        [TestMethod]
        public void AddSeasonInTheRepo()
        {
            List<Season> seasons = CreateSeasonList();
            List<Season> added = new List<Season>();
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Add(It.IsAny<Season>()))
                .Returns(Task.FromResult(seasons.FirstOrDefault()))
                .Callback<Season>(c => added.Add(c));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), null))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Testing all the list that we can retrieve correctly the seasons
            for (int i = 0; i < seasons.Count; i++)
            {
                HttpResponseMessage response = controller.Post(seasons[i]).Result;
                // the result should say "HttpStatusCode.Created"
                Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
            }

            // the added list should be the same as the list
            CollectionAssert.AreEqual(seasons, added);
        }


        // Verifying the Add method fail if the country is unknown
        [TestMethod]
        public void AddfailureSeasonCountryUnknownInTheRepo()
        {
            Season season = new Season();
            List<Season> added = new List<Season>();
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Add(It.IsAny<Season>()));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult((Country)null));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(season).Result;
            // the result should say "HttpStatusCode.Created"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureSeasonInTheRepo()
        {
            Season season = new Season();
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Add(It.IsAny<Season>()));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(0, null, null))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(season).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNullSeasonInTheRepo()
        {
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Add(It.IsAny<Season>()));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure exist name in the repo
        [TestMethod]
        public void AddFailureSeasonNameExistsInTheRepo()
        {
            Season season = new Season();
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Add(It.IsAny<Season>()));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), null))
                .Returns(Task.FromResult(true));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(season).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }

                        
        // Verifying the Update failure method
        [TestMethod]
        public void UpdateSeasonInTheRepo()
        {
            Season season = new Season();

            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Season>()))
                .Returns(Task.FromResult(true));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            Season modifiedseason = new Season();
            modifiedseason.Id = season.Id;
            modifiedseason.Name = "ModifiedName";
            HttpResponseMessage response = controller.Put(modifiedseason.Id, modifiedseason).Result;
            // the result should say "HttpStatusCode.Created" and the returned object should have a different lastName
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);

            var objectContent = response.Content as ObjectContent;
            Assert.AreNotEqual(season.Name, ((Season)objectContent.Value).Name);

        }


        // Verifying the update method fail if the country is unknown
        [TestMethod]
        public void UpdatefailureSeasonCountryUnknownInTheRepo()
        {
            Season season = new Season();
            List<Season> added = new List<Season>();
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Season>()));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult((Country)null));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(season.Id, season).Result;
            // the result should say "HttpStatusCode.Created"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureSeasonInTheRepo()
        {
            Season season = new Season();

            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Season>()))
                .Returns(Task.FromResult(true));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Put(season.Id, season).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureNullSeasonInTheRepo()
        {
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Season>()))
                .Returns(Task.FromResult(true));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(1,null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure exist name in the repo
        [TestMethod]
        public void UpdateFailureSeasonNameExistsInTheRepo()
        {
            Season season = new Season();
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Add(It.IsAny<Season>()));
            mock.As<ISeasonRepository>().Setup(m => m.isSeasonNameExist(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Put(1, season).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteSeasonInTheRepo()
        {
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.OK"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteFailureSeasonInTheRepo()
        {
            var mock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Season, int, SeasonFilter>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            var mockCountryRepo = new Mock<ICountryRepository>(MockBehavior.Strict);
            mockCountryRepo.As<ICRUDRepository<Country, int, CountryFilter>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(new Country()));

            // Creating the controller which we want to create
            SeasonController controller = new SeasonController(mock.Object, mockCountryRepo.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.NotFound"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);
        }


    }


}
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
    public class countryControllerTests
    {

        public static void fakeContext(ApiController controller)
        {
            // arrange
            var config = new HttpConfiguration();
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/Country");
            var route = config.Routes.MapHttpRoute("defaultAPI", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary(new { controller = "product" }));
            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Url = new UrlHelper(request);
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            controller.Request.Properties[HttpPropertyKeys.HttpRouteDataKey] = routeData;
        }

        // Method used to generate a country list
        public List<Country> CreateCountryList()
        {

            var countrys = new List<Country>
        {
            new Country{Id=1,Name="Scotland"},
            new Country{Id=2,Name="England"},
            new Country{Id=3,Name="Germany"}
        };

            return countrys;
        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveACountryInTheRepo()
        {
            List<Country> countrys = CreateCountryList();

            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int>(id => Task.FromResult(countrys.FirstOrDefault(c => c.Id == id)));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(countrys[0], objectContent.Value);


        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveFailureACountryInTheRepo()
        {
            List<Country> countrys = CreateCountryList();

            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Get(It.IsAny<int>()))
                .Returns<int?>(id => Task.FromResult(countrys.FirstOrDefault(c => false)));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);

        }

        // Verifying the getAll method
        [TestMethod]
        public void RetrieveAllcountrysInTheRepo()
        {
            IEnumerable<Country> countrys = CreateCountryList();

            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.GetAll())
                .Returns(Task.FromResult(countrys));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(countrys, objectContent.Value);

        }


        // Verifying the Add method
        [TestMethod]
        public void AddCountryInTheRepo()
        {
            List<Country> countrys = CreateCountryList();
            List<Country> added = new List<Country>();
            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Add(It.IsAny<Country>()))
                .Returns(Task.FromResult(countrys.FirstOrDefault()))
                .Callback<Country>(c => added.Add(c));

            mock.As<ICountryRepository>().Setup(m => m.isCountryNameExist(It.IsAny<string>(), null))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Testing all the list that we can retrieve correctly the countrys
            for (int i = 0; i < countrys.Count; i++)
            {
                HttpResponseMessage response = controller.Post(countrys[i]).Result;
                // the result should say "HttpStatusCode.Created"
                Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
            }

            // the added list should be the same as the list
            CollectionAssert.AreEqual(countrys, added);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureCountryInTheRepo()
        {
            Country country = new Country();
            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Add(It.IsAny<Country>()));

            mock.As<ICountryRepository>().Setup(m => m.isCountryNameExist(It.IsAny<string>(), null))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(country).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNameExistsCountryInTheRepo()
        {
            Country country = new Country();
            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Add(It.IsAny<Country>()));
            // Setting up that the country name already exist
            mock.As<ICountryRepository>().Setup(m => m.isCountryNameExist(null, null))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(country).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNullCountryInTheRepo()
        {
            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Add(It.IsAny<Country>()));

            mock.As<ICountryRepository>().Setup(m => m.isCountryNameExist(It.IsAny<string>(), null))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


                        
        // Verifying the Update failure method
        [TestMethod]
        public void UpdateCountryInTheRepo()
        {
            Country country = new Country();

            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Country>()))
                .Returns(Task.FromResult(true));

            mock.As<ICountryRepository>().Setup(m => m.isCountryNameExist(It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            Country modifiedcountry = new Country();
            modifiedcountry.Id = country.Id;
            modifiedcountry.Name = "ModifiedName";
            HttpResponseMessage response = controller.Put(modifiedcountry.Id, modifiedcountry).Result;
            // the result should say "HttpStatusCode.Created" and the returned object should have a different lastName
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);

            var objectContent = response.Content as ObjectContent;
            Assert.AreNotEqual(country.Name, ((Country)objectContent.Value).Name);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureCountryInTheRepo()
        {
            Country country = new Country();

            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Country>()))
                .Returns(Task.FromResult(true));
            mock.As<ICountryRepository>().Setup(m => m.isCountryNameExist(null, null))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(country).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureNullCountryInTheRepo()
        {
            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Country>()))
                .Returns(Task.FromResult(true));
            mock.As<ICountryRepository>().Setup(m => m.isCountryNameExist(It.IsAny<string>(), It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method if country exists
        [TestMethod]
        public void UpdateFailureCountryNameExistsInTheRepo()
        {
            Country country = new Country();
            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Update(It.IsAny<int>(), It.IsAny<Country>()))
                .Returns(Task.FromResult(true));
            mock.As<ICountryRepository>().Setup(m => m.isCountryNameExist(null, null))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(country).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteCountryInTheRepo()
        {
            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteFailureCountryInTheRepo()
        {
            var mock = new Mock<ICountryRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<Country, int>>().Setup(m => m.Remove(It.IsAny<int>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            CountryController controller = new CountryController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete(0).Result;
            // the result should say "HttpStatusCode.NotFound"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);
        }


    }


}
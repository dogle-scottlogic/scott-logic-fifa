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
        public class resultViewControllerTests : AbstractControllerTest
    {
        public List<ResultViewModel> CreateResultViewList()
        {

            var results = new List<ResultViewModel>
        {
            new ResultViewModel{Date=DateTime.Today},
            new ResultViewModel{Date=DateTime.Now},
            new ResultViewModel{Date=DateTime.Now}
        };

            return results;
        }

        // Verifying the getAll method
        [TestMethod]
        public void RetrieveAllResultsInTheRepo()
        {
            List<ResultViewModel> results = CreateResultViewList();

            var mock = new Mock<IMatchViewRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<IMatchViewRepository>().Setup(m => m.GetAllPlayedMatches(null))
                .Returns(Task.FromResult(results));

            // Creating the controller which we want to create
            ResultViewController controller = new ResultViewController(mock.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(results, objectContent.Value);

        }

        // Verifying the getAll method with nothing found
        [TestMethod]
        public void RetrieveNoResultsInTheRepo()
        {

            var mock = new Mock<IMatchViewRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<IMatchViewRepository>().Setup(m => m.GetAllPlayedMatches(null))
                .Returns(Task.FromResult((List<ResultViewModel>)null));

            // Creating the controller which we want to create
            ResultViewController controller = new ResultViewController(mock.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;

        }



    }


}
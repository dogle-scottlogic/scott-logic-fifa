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
        public class teamPlayerStatisticViewTests : AbstractControllerTest
    {

        // Verifying the get(int idTeamPlayer, int idSeason) method
        [TestMethod]
        public void RetrieveATeamPlayerInTheRepo()
        {
            TeamPlayerSeasonStatisticViewModel tp = new TeamPlayerSeasonStatisticViewModel();
            int calledTPId = 0;
            int calledSeasonId = 0;

            var mock = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);
            
            // Filling mock with data
            mock.As<ITeamPlayerRepository>().Setup(m => m.GetTeamPlayerStatisticForASeason(It.IsAny<int>(), It.IsAny<int>()))
                .Callback((int tpId, int seasonId) =>
                {
                    calledTPId = tpId;
                    calledSeasonId = seasonId;
                })
                .Returns(Task.FromResult(tp));

            // Creating the controller which we want to create
            TeamPlayerStatisticViewController controller = new TeamPlayerStatisticViewController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            int inputParamTPId = 1;
            int inputParamSeasonId = 1;
            HttpResponseMessage response = controller.Get(inputParamTPId, inputParamSeasonId).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            // Verifying that the parameters have correctly been passed on the repo
            Assert.AreEqual(calledTPId, inputParamTPId);
            Assert.AreEqual(calledSeasonId, inputParamSeasonId);
            Assert.AreEqual(tp, objectContent.Value);


        }

        // Verifying the get(int idTeamPlayer, int idSeason) method if null is returned
        [TestMethod]
        public void RetrieveATeamPlayerFailureInTheRepo()
        {

            var mock = new Mock<ITeamPlayerRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ITeamPlayerRepository>().Setup(m => m.GetTeamPlayerStatisticForASeason(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult((TeamPlayerSeasonStatisticViewModel)null));

            // Creating the controller which we want to create
            TeamPlayerStatisticViewController controller = new TeamPlayerStatisticViewController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get(1, 1).Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);

        }

    }


}
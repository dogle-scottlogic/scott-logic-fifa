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
using Microsoft.AspNet.Identity.EntityFramework;

namespace FIFATests.ControllerTests
{
    [TestClass]
        public class userControllerTests : AbstractControllerTest
    {
        // Method used to generate a identityUser list
        public List<IdentityUser> CreateIdentityUserList()
        {

            var identityUsers = new List<IdentityUser>
        {
            new IdentityUser{Id="1",UserName="User 1"},
            new IdentityUser{Id="2",UserName="User 2"},
            new IdentityUser{Id="3",UserName="User 3"}
        };

            return identityUsers;
        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveAnIdentityUserInTheRepo()
        {
            List<IdentityUser> identityUsers = CreateIdentityUserList();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Get(It.IsAny<string>()))
                .Returns<string>(id => Task.FromResult(identityUsers.FirstOrDefault(u => u.Id == id)));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get("1").Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(identityUsers[0], objectContent.Value);


        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveFailureAnIdentityUserInTheRepo()
        {
            List<IdentityUser> identityUsers = CreateIdentityUserList();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Get(It.IsAny<string>()))
                .Returns<string>(id => Task.FromResult((IdentityUser)null));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get("1").Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);

        }

        // Verifying the getAll method
        [TestMethod]
        public void RetrieveAllIdentityUsersInTheRepo()
        {
            IEnumerable<IdentityUser> identityUsers = CreateIdentityUserList();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.GetAll())
                .Returns(Task.FromResult(identityUsers));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(identityUsers, objectContent.Value);

        }


        // Verifying the Add method
        [TestMethod]
        public void AddIdentityUserInTheRepo()
        {
            List<IdentityUser> identityUsers = CreateIdentityUserList();
            List<IdentityUser> added = new List<IdentityUser>();
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Add(It.IsAny<IdentityUser>()))
                .Returns(Task.FromResult(identityUsers.FirstOrDefault()))
                .Callback<IdentityUser>(c => added.Add(c));

            mock.As<IUserRepository>().Setup(m => m.isUserNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));
            
            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Testing all the list that we can retrieve correctly the identityUsers
            for (int i = 0; i < identityUsers.Count; i++)
            {
                HttpResponseMessage response = controller.Post(identityUsers[i]).Result;
                // the result should say "HttpStatusCode.Created"
                Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
            }

            // the added list should be the same as the list
            CollectionAssert.AreEqual(identityUsers, added);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureIdentityUserInTheRepo()
        {
            IdentityUser identityUser = new IdentityUser();
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Add(It.IsAny<IdentityUser>()));

            mock.As<IUserRepository>().Setup(m => m.isUserNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));
            
            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(identityUser).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNameExistsIdentityUserInTheRepo()
        {
            IdentityUser identityUser = new IdentityUser();
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Add(It.IsAny<IdentityUser>()));

            mock.As<IUserRepository>().Setup(m => m.isUserNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(identityUser).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNullIdentityUserInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Add(It.IsAny<IdentityUser>()));

            mock.As<IUserRepository>().Setup(m => m.isUserNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }
                        
        // Verifying the Update failure method
        [TestMethod]
        public void UpdateIdentityUserInTheRepo()
        {
            IdentityUser identityUser = new IdentityUser();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<IdentityUser>()))
                .Returns(Task.FromResult(true));

            mock.As<IUserRepository>().Setup(m => m.isUserNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));
            
            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            IdentityUser modifiedidentityUser = new IdentityUser();
            modifiedidentityUser.Id = identityUser.Id;
            modifiedidentityUser.UserName = "ModifiedName";
            HttpResponseMessage response = controller.Put(modifiedidentityUser.Id, modifiedidentityUser).Result;
            // the result should say "HttpStatusCode.Created" and the returned object should have a different lastName
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);

            var objectContent = response.Content as ObjectContent;
            Assert.AreNotEqual(identityUser.UserName, ((IdentityUser)objectContent.Value).UserName);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureIdentityUserInTheRepo()
        {
            IdentityUser identityUser = new IdentityUser();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<IdentityUser>()))
                .Returns(Task.FromResult(true));


            mock.As<IUserRepository>().Setup(m => m.isUserNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);
                // configuring the context for the controller
            fakeContext(controller);

            // Facking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

                HttpResponseMessage response = controller.Put("1", identityUser).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureNullIdentityUserInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<IdentityUser>()))
                .Returns(Task.FromResult(true));


            mock.As<IUserRepository>().Setup(m => m.isUserNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

                HttpResponseMessage response = controller.Put("1", null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method if identityUser exists
        [TestMethod]
        public void UpdateFailureIdentityUserNameExistsInTheRepo()
        {
            IdentityUser identityUser = new IdentityUser();
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<IdentityUser>()))
                .Returns(Task.FromResult(true));


            mock.As<IUserRepository>().Setup(m => m.isUserNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

                HttpResponseMessage response = controller.Put("1", identityUser).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteIdentityUserInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Remove(It.IsAny<string>()))
                .Returns(Task.FromResult(true));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete("0").Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteFailureIdentityUserInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<IdentityUser, string, UserFilter>>().Setup(m => m.Remove(It.IsAny<string>()))
                .Returns(Task.FromResult(false));

            // Creating the controller which we want to create
            UserController controller = new UserController(mock.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete("0").Result;
            // the result should say "HttpStatusCode.NotFound"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);
        }


    }


}
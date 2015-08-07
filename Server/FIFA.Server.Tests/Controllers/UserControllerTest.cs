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
using FIFA.Server.Models.Authentication;

namespace FIFATests.ControllerTests
{
    [TestClass]
        public class userControllerTests : AbstractControllerTest
    {
        // Method used to generate a userModel list
        public List<UserModel> CreateUserModelList()
        {

            var userModels = new List<UserModel>
        {
            new UserModel{Id="1",Name="User 1", Password="mo"},
            new UserModel{Id="2",Name="User 2", Password="mo"},
            new UserModel{Id="3",Name="User 3", Password="mo"}
        };

            return userModels;
        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveAnUserModelInTheRepo()
        {
            List<UserModel> userModels = CreateUserModelList();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Get(It.IsAny<string>()))
                .Returns<string>(id => Task.FromResult(userModels.FirstOrDefault(u => u.Id == id)));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get("1").Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(userModels[0], objectContent.Value);


        }

        // Verifying the get(i) method
        [TestMethod]
        public void RetrieveFailureAnUserModelInTheRepo()
        {
            List<UserModel> userModels = CreateUserModelList();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Get(It.IsAny<string>()))
                .Returns<string>(id => Task.FromResult((UserModel)null));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Get("1").Result;
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);

        }

        // Verifying the getAll method
        [TestMethod]
        public void RetrieveAllUserModelsInTheRepo()
        {
            IEnumerable<UserModel> userModels = CreateUserModelList();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.GetAll())
                .Returns(Task.FromResult(userModels));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            fakeContext(controller);

            HttpResponseMessage response = controller.GetAll().Result;

            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
            var objectContent = response.Content as ObjectContent;
            Assert.AreEqual(userModels, objectContent.Value);

        }


        // Verifying the Add method
        [TestMethod]
        public void AddUserModelInTheRepo()
        {
            List<UserModel> userModels = CreateUserModelList();
            List<UserModel> added = new List<UserModel>();
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock with data
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Add(It.IsAny<UserModel>()))
                .Returns(Task.FromResult(userModels.FirstOrDefault()))
                .Callback<UserModel>(c => added.Add(c));

            mock.As<IUserRepository>().Setup(m => m.isNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controler
            fakeContext(controller);

            // Testing all the list that we can retrieve correctly the userModels
            for (int i = 0; i < userModels.Count; i++)
            {
                HttpResponseMessage response = controller.Post(userModels[i]).Result;
                // the result should say "HttpStatusCode.Created"
                Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);
            }

            // the added list should be the same as the list
            CollectionAssert.AreEqual(userModels, added);
        }
        
        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureUserModelInTheRepo()
        {
            UserModel userModel = new UserModel();
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Add(It.IsAny<UserModel>()));

            mock.As<IUserRepository>().Setup(m => m.isNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);

            // configuring the context for the controler
            fakeContext(controller);

            // Faking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

            HttpResponseMessage response = controller.Post(userModel).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the Add failure name empty method
        [TestMethod]
        public void AddFailureNameEmptyUserModelInTheRepo()
        {
            UserModel userModel = new UserModel();
            userModel.Name = "";
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Add(It.IsAny<UserModel>()));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(userModel).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }

        // Verifying the Add failure password empty method
        [TestMethod]
        public void AddFailurePasswordEmptyUserModelInTheRepo()
        {
            UserModel userModel = new UserModel();
            userModel.Name = "user";
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Add(It.IsAny<UserModel>()));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(userModel).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }

        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNameExistsUserModelInTheRepo()
        {
            UserModel userModel = new UserModel();
            userModel.Name = "user";
            userModel.Password = "pwd";
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Add(It.IsAny<UserModel>()));

            mock.As<IUserRepository>().Setup(m => m.isNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(true));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(userModel).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Add failure method
        [TestMethod]
        public void AddFailureNullUserModelInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Filling mock rull with repository
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Add(It.IsAny<UserModel>()));

            mock.As<IUserRepository>().Setup(m => m.isNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);

            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Post(null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }
                        
        // Verifying the Update failure method
        [TestMethod]
        public void UpdateUserModelInTheRepo()
        {
            UserModel userModel = new UserModel();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<UserModel>()))
                .Returns(Task.FromResult(true));

            mock.As<IUserRepository>().Setup(m => m.isNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controler
            fakeContext(controller);

            UserModel modifieduserModel = new UserModel();
            modifieduserModel.Id = userModel.Id;
            modifieduserModel.Name = "ModifiedName";
            HttpResponseMessage response = controller.Put(modifieduserModel.Id, modifieduserModel).Result;
            // the result should say "HttpStatusCode.Created" and the returned object should have a different lastName
            Assert.AreEqual(response.StatusCode, HttpStatusCode.Created);

            var objectContent = response.Content as ObjectContent;
            Assert.AreNotEqual(userModel.Name, ((UserModel)objectContent.Value).Name);

        }

        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureNameEmptyUserModelInTheRepo()
        {
            UserModel userModel = new UserModel();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<UserModel>()))
                .Returns(Task.FromResult(true));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controller
            fakeContext(controller);
            
            HttpResponseMessage response = controller.Put("1", userModel).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureUserModelInTheRepo()
        {
            UserModel userModel = new UserModel();

            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<UserModel>()))
                .Returns(Task.FromResult(true));


            mock.As<IUserRepository>().Setup(m => m.isNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controller
            fakeContext(controller);

            // Faking a model error
            controller.ModelState.AddModelError("key", "errorMessage");

                HttpResponseMessage response = controller.Put("1", userModel).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method
        [TestMethod]
        public void UpdateFailureNullUserModelInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<UserModel>()))
                .Returns(Task.FromResult(true));


            mock.As<IUserRepository>().Setup(m => m.isNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(false));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controler
            fakeContext(controller);

                HttpResponseMessage response = controller.Put("1", null).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the Update method if userModel exists
        [TestMethod]
        public void UpdateFailureUserModelNameExistsInTheRepo()
        {
            UserModel userModel = new UserModel();
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Update(It.IsAny<string>(), It.IsAny<UserModel>()))
                .Returns(Task.FromResult(true));


            mock.As<IUserRepository>().Setup(m => m.isNameExist(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(true));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controler
            fakeContext(controller);

                HttpResponseMessage response = controller.Put("1", userModel).Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);

        }


        // Verifying the delete method
        [TestMethod]
        public void DeleteUserModelInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Remove(It.IsAny<string>()))
                .Returns(Task.FromResult(true));
            
            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);
            mockUserTool.Setup(u => u.GetCurrentUserId()).Returns("1");
            

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete("0").Result;
            // the result should say "HttpStatusCode.BadRequest"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.OK);
        }

        // Verifying the delete method
        [TestMethod]
        public void DeleteFailureCurrentUserModelInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Remove(It.IsAny<string>()))
                .Returns(Task.FromResult(false));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);
            mockUserTool.Setup(u => u.GetCurrentUserId()).Returns("0");

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete("0").Result;
            // the result should say "HttpStatusCode.NotFound"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.BadRequest);
        }

        // Verifying the delete method
        [TestMethod]
        public void DeleteFailureUserModelInTheRepo()
        {
            var mock = new Mock<IUserRepository>(MockBehavior.Strict);

            // Creating the rules for mock, always send true in this case
            mock.As<ICRUDRepository<UserModel, string, UserFilter>>().Setup(m => m.Remove(It.IsAny<string>()))
                .Returns(Task.FromResult(false));


            var mockUserTool = new Mock<ICurrentUserTool>(MockBehavior.Strict);
            mockUserTool.Setup(u => u.GetCurrentUserId()).Returns("1");

            UserController controller = new UserController(mock.Object, mockUserTool.Object);
            // configuring the context for the controler
            fakeContext(controller);

            HttpResponseMessage response = controller.Delete("0").Result;
            // the result should say "HttpStatusCode.NotFound"
            Assert.AreEqual(response.StatusCode, HttpStatusCode.NotFound);
        }


    }


}
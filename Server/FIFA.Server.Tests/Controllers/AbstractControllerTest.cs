using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Hosting;
using System.Web.Http.Routing;

namespace FIFATests.ControllerTests
{
    public class AbstractControllerTest
    {
        public static void fakeContext(ApiController controller)
        {
            // arrange
            var config = new HttpConfiguration();
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/");
            var route = config.Routes.MapHttpRoute("defaultAPI", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary(new { controller = "product" }));
            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Url = new UrlHelper(request);
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            controller.Request.Properties[HttpPropertyKeys.HttpRouteDataKey] = routeData;
        }
    }
}

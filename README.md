# Scott Logic - FIFA
This project is designed to track XBox FIFA play within the Edinburgh office.

To set the project up locally:
* git clone the repo
* to make the server side work: open the Server project in Visual Studio and run it! that's it :)
* to make the client side work: go in the Client project and run 'npm install', 'bower install'. To generate the initial Typescript config files, do an 'npm install tsd --g', then run 'tsd install'.
* to start up the client, navigate to the Client project and run 'gulp' in the console. This will start the node server.
If you navigate to http://localhost:3000 you should see our lovely landing page :)  
* to deploy up the client, navigate to the Client project and run 'gulp production' in the console.This will start a node server. With error to reach the server (because it will try to reach on the same url / port than the node server)
Then, you can run the client and the server on IIS :
- In IIS, Add a website to the path Server/FIFA.Server (Application pool : ASP.NET v4.0)
- Then Add an application to the path Client/dist/ to this website (for exemple with the alias FIFA)
=> If you have an issue with writting to the database, in the IIS / Application Pools, ASP.NET v4.0, Advanced Settings..., set Identity to "Built-in-account" : LocalSystem

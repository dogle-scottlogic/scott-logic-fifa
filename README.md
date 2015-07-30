# Scott Logic - FIFA
This project is designed to track XBox FIFA play within the Edinburgh office.

To set the project up locally:
* git clone the repo
* to make the server side work: open the Server project in Visual Studio and run it! that's it :)
* to make the client side work: go in the Client project and run 'npm install', 'bower install'. To generate the initial Typescript config files, do an 'npm install tsd --g', then run 'tsd install'.
* to start up the client, navigate to the Client project and run 'gulp' in the console. This will start the node server.
If you navigate to http://localhost:3000 you should see our lovely landing page :)  
* to deploy up the client, navigate to the Client project and run 'gulp production' in the console.This will create (or fill) a "Client" folder in "Server\FIFA.Server" and start a node server. The web page shall display  error to reach the server (because it will try to reach on the same url / port than the node server anyway, the goal is only make sure that the client is correctly deployed). You can then "kill" the process "gulp production".
To serve the application on azure (Make sure that you have the Client directory) :
- In visual studio, right click on the FIFA.Server project select "Publish..." and publish.
- You can then reach the api on the root of the server url and the client on /client.

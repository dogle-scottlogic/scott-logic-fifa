Process for putting changes into dev

1. Push change to new branch
2. Create pull request
3. Have it code reviewed
4. Merge branch to dev
5. Run app and tests to ensure it still works
6. run "gulp production" task (this creates the client in the client folder - [see Fab's notes]
7. Go to visual studio, right click on the server project and select "Publish..."
8. From the drop-down select xb-fifaleague-test - Web Deploy and publish
9. If you made changes to the client, right click on the client folder within the server project (in visual studio) and publish it.
10. Ensure it works
11. Push to git origin
12. Move the JIRA to the dev column

For pre-prod the process is the same except you push to the pre-prod branch and publish to xb-fifaleague-preprod.
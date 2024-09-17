# Software Innovation Studio - Camprisma
**README Last Updated:** 17/09/2024

Camprisma, the app for foragers, whether you are a beginner needing a start or a natural looking for new ways to elevate your bush cooking!

The goal of our team is to develop an assistive tool that could aid foragers to​ identify different species of editable​ bushfoods and how to cook them in a​ camping-based cooking set up. 

## Our Team - Team 20
- Lily Watt - Project Lead/Backend Developer
- Swethashree Ganesh - Backend Developer/AI Trainer
- Wyatt Dyer - ML/AI/Computer Vision Trainer
- Aneeka Mehta - UI/UX/Frontend Developer
- Dulya Manodara - Backend Developer/Tester
- Sauhasrdha Pandey - Frontend Developer/Full Stack Developer

## Setup/Build
For testing on your local device, first, prior to attempting to run anything, change to testing branch and ```git fetch``` the most recent changes. Once this is complete, make sure you have the ```.env``` in the server folder and change all requests from ```http://192.168.50.169:8080``` to your own computer’s ip:8080.

For building the application on your local device, please ```cd``` into **BOTH** the client and server folders in two seperate terminals. Next, in the client terminal, run...
``` bash
npm start
``` 
Proceed by changing to Expo Go by pressing ```s``` in your terminal after it executes. Next, in the other "/server" terminal tab, run...
``` bash
node server.js
```
You should now be able to test the application.

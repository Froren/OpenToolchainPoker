# Building an AI Poker Tournament: Quick Collaboration Using Bluemix DevOps Open Toolchain
---

## Introduction
Welcome! In this lightning session we'll be using the [Open Toolchain](https://developer.ibm.com/devops-services/2016/06/16/open-toolchain-with-ibm-bluemix-devops-services/) feature of Bluemix to run an automated poker tournament among robot players.

Bolder participants with knowledge of Javascript and poker mechanics will also be able to create their own AI players and contribute them back to this repository, competing against the other attendees of this session.

Any additions to this repository (through pull requests) will automatically trigger a run of a set of tournaments. You can view the results of past tournaments at this link: [otc-poker-leaderboard.mybluemix.net](https://otc-poker-leaderboard.mybluemix.net)

The page will display the last 5 sets of tournaments, with the timestamp, players, and chip totals of each AI. This leaderboard will automatically update when new tournaments are played.

As with any other labs, please don't hesitate to ask questions if you get stuck. Enjoy!

*The code for this lab was built on the [JsPoker](https://github.com/mdp/JsPoker) project by Mark Percival. Check it out if this lab interests you.*

----

### Prerequisite Accounts

You will need to have a [Bluemix](https://www.bluemix.net) account for this lab. You will also need a [Github](https://github.com/) account if you intend to experiment with creating a new bot.

After creating the Bluemix account, you will also need to create an _organization_ and a _space_ in your account after logging in.

--------
### What is a toolchain?
A toolchain is connected set of tools that can be adapted to suit the needs of a software development team. Different teams may have entirely different toolchains, as they should be unique to the different style of development or culture that a team may have. The idea is championed by the [Bluemix Garage Method](https://www.ibm.com/devops/method) as a DevOps practice to deliver code in a more effective way.

Open Toolchains in Bluemix allow users to collect and integrate a set of tools from a common tool catalogue with little configuration required. Toolchain templates can also be created to onboard other developers or development teams with ease. A full development environment can be shared to a team and setup within a few seconds.

In our lab we will utilize a handful of integrations to run our code quickly. Feel free to diverge from the lab and experiment with adding different tools as we go along.

[More information on Open Toolchain](https://www.ibm.com/devops/method/category/tools)

--------

### Creating a Toolchain and running the tournament

1) Once you've logged into Bluemix, navigate to https://new-console.ng.bluemix.net/#overview to access the new Bluemix layout.

2) Click on the **DevOps** option from the landing page or the _Console_ dropdown on the top bar.

3) Click on the **Toolchains** tab on the top bar.

4) Click on `Enable Toolchains` and accept the terms and conditions prompt.

5) Click on `Create a toolchain`.

6) Select `Build your own toolchain` from the _Advanced_ section on the bottom.

7) Choose a name and click Create to finish the creation process.

8) Click `View Toolchain` or wait to be redirected. _Congratulations~!_

9) From here, we'll want to add some integrations to the toolchain. Click the `+` symbol on the right to add a tool.

10) Select `Github`. You may need to **Authorize** Github if this is your first time using it in a Toolchain.

11) After authorizing, choose `Fork` as the Repository Type and enter the URL of this repository as the Source URL. (https://github.com/Froren/OpenToolchainPoker)

12) A Github repository should now be on your toolchain. Click on the `+` symbol again to add another integration.

13) Select the `Delivery Pipeline`. Enter a name for your pipeline and click Create.

14) Click into the new Pipeline integration from your toolchain page.

15) Click on `Add Stage` to create a new Pipeline stage to run our tournament. You can give it a suitable tournament-sounding name. Deathmatch 2016, perhaps.

16) Verify that the **Input Type** is set to `SCM Repository` and that the **Stage Trigger** is set to `Run jobs whenever a change is pushed to Git`

17) Click the `Jobs` tab at the top and create a new `Build` job

18) Set **Builder Type** to be `npm`

19) In the text box, after `npm install`, make a new line and type in `node play`

20) Save the stage and give Randall 5 dollars.

21) In the newly created stage, click into the `Build` job in the middle of the tile.

22) Click `Run` at the top and the automated tournament will run in the console. You can use the down arrow at the bottom right of the screen to quickly navigate to the end of the tournament.

The tournament will list out the action that each bot took, at each stage of the game. You can study the actions of each bot and the success of it's strategy as the game progresses. The tournament is set to run for 200 hands, or fewer if a bot got lucky.

Feel free to re-run the stage a few times to see the result of different tournaments. You may notice a high variability of winners because these bots are pretty dumb. That's a profound life lesson being illustrated here. Gamble responsibly, friends.

The latter parts of the lab are encouraged but optional. They deal with creating your own bot, which will require some knowledge of Javascript and poker. We hope you enjoyed experimenting with Open Toolchains and running poker simulations with Bluemix.

Please let me know if you have any questions, concerns, or feedback for our product. I'd also love to know what you thought of the lab as well. _(No, we can't integrate Watson with it.)_

-----
## Creating your own bot (abridged)

You'll want to make a test stage. Follow the same steps as before for a pipeline stage except use `node test/challenger_test.js` for the run command instead of `node play`.

This test stage allows you to run quick tournaments against the challenger bot. You'll be able to see the result of a tournament in a single line. Play around with it.

Create a WebIDE instance and open up the repo. You'll need to make edits to `players/challengerBot.js`. You can't use any external modules, but you can define any libraries you need inside the file.

The logic is pretty simple, the *update* function will be called multiple times within a single round, the **game** parameter holds all the information about the game that's visible to your bot. You can find examples of some game states in the `gameStates` folder.

The *update* function just needs to return an integer. If the value is equal to the current call amount (game.betting.call), it is considered a *call*. Any amount lower is a *fold*, any amount higher is a *raise*.

You can learn from the existing bots in the `veterans` folder, where they've been caged because they're too powerful. The existing players are pretty simple if you take a look at their source.

Commit any changes you make through WebIDE and check the pipeline to see how you fare.

### Contribute your bot to the repository

From here I think a fresh fork would be best, because you need to reset your changes on challengerBot.
- Take the logic you've put in challengerBot and create a new bot in the `players` folder. Reset challengerBot to a blank slate.
- Add your new bot to `test/tournament.js`
- Commit your changes and open a PR against the repository on Github.


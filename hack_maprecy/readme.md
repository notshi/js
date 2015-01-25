Out of all the issues we spoke about when we broke into our groups, which was plenty and varied and possibly touched upon later in this post, was the ultimate agreement that there was needed a single tool, *or aid if you will*, to collate everything into a legible whole. 


######A visual tool,  a snapshot, something to indicate simply all that data found in the spreadsheets; of which are many.


Before I delve further into this “tool”, let’s touch on a couple of the issues we spoke about.

######Improving the quality of items being recycled as contaminated waste was a big problem which contributed to money and labour loss.
Our suggested solution was a simple “**20 Questions**” game that was presented as an app to help those that are unsure of the items they were wanting to recycle. Simple load the app, answer a series of “Yes” or “No” questions about the item; eg. “Is it glass?” and by the end or before the end of 20 questions, the item would have been uniquely identified and shown the appropriate method of recycling. *Mathematically speaking, 20 questions is enough to uniquely identify 1 million items.*

######The other issue was to evoke a sense of civic pride, community and competition. Motivation to recycle is tricky.
Short of celebrity endorsement by asking Taylor Swift, One Direction or Justin Bieber to promote recycling, we thought of a scheme based on data and gamification. “**My Street Is Greener Than Yours**” is a simple game of statistics. With the data collected, we should be able to break it down to a granular level and so build statistics per street. With striking illustrations on a web site, users can log on and track their “progress” whilst comparing it to their neighbours. Badges and achievements increase participation and the best street of the month or year gets a banner they can put on their bins etc.

Anyway, we decided to work with the data provided and come up with a solution that was viable to develop in the 3 hours we were given.

===================

#### What did we make?
**Leeds Waste Side Stories** visualises the data by displaying recycling activities on a map with highlighted and relatable data points. With a glance, you are able to digest a large table of data in visual form. Cycle through different views by clicking on the different waste links (Black Bin, Green Bin and Food).

#### Which data was used? 
1. RefuseCollectionTonnageData.csv
2. RoutePropertyData.csv
3. HWSSRecycling13-14.csv


#### How is the data calculated? 
For the **Map** (*Data 1 & 2*): We have the location of the bins and we have the amount of waste produced by routes that pick up waste from selected bins. By spreading the quantity of waste back along these routes, weighted by size of bin since there are various sizes, we can display an approximation of what waste has been picked up at each location.

For the **Snapshots** (*Data 3*): Manual calculations using mathematical functions were used within the spreadsheet to derive averages. Weight in tonnes were compared to actual weights of materials from different sources on the internet.

#### Problems? 
The data sets provided were incomplete so we were only able to display a subset of the data. The values we could show on the map are only an approximation as we cannot be sure of the exact amount of waste picked up from each location. All of these can be improved with better data collection; complete data sets with higher quality data and of course more development time. 


===================

###### Attributions (Thank you!)
1. Elephant icon by Nicolas Ramallo from http://thenounproject.com/term/elephant/7185/
2. Ink Cartridge icon by Dan Hetteix from http://thenounproject.com/term/ink-cartridge/20277/
3. Soda Can icon by Lloyd Humphreys from http://thenounproject.com/term/can/96451/
4. Tetrapak icon by Jannis Schäfer from http://thenounproject.com/term/carton/88557/

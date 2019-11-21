# NewsScraper
## Deployed Project
[Heroku](https://hw-newsscraper.herokuapp.com/)

## Purpose
This app was created to scrape and present the latest articles from Engadget's website

## Overview
Using various web and server technologies, articles from Engadget are stored to a database.  The article's title, summary and link to the full article are provided. The client can add and remove comments from an article.

## Technologies Used
* Node.JS
* ExpressJS
* Express-Handlebars
* MongoDB/Mongoose
* Axios
* Cheerio

## Usage
### Getting new Articles
Clicking the "Get New Articles" button will retrieve the latest news from Engadget, and display the Title, Summary, and Link to the article.

### Comments  
Comments can be viewed with the "View/Add Comments" button at each article.  
![img](./images/viewComments.png)

This button will also show how many comments that are saved for it's article.

Once clicked, a modal will open, showing any saved comments, and providing a field to add a comment.

![img](./images/withComments.png)
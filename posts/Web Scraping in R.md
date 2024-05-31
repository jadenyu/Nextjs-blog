---
title: 'Tutorial: Web Scraping in R'
date: '2024-05-30'
---

# Introduction


Web scraping has become a crucial aspect of the digital business landscape, allowing for the extraction and analysis of public data to gain insights that can transform and improve various business prospects. 
R is a popular programming language for data and statistical analysis that offers powerful open-source libraries, making web scraping more accessible. Its libraries can handle various web scraping tasks, and web scraping can efficiently generate datasets within R, saving time and effort. 
This tutorial covers the basics of web scraping using R, from scraping static pages to dynamic sites that utilize JavaScript.


# Prerequisites

## Set up the environment

The first stage is to prepare the development environment for R. Two components will be needed – R and an R IDE.
- R: To download and install R, visit [this page](https://cran.r-project.org/). And select the version of your corresponding system, then installing the base version of R will be enough. 
- R IDE: RStudio is the recommended IDE for this tutorial, as it provides an intuitive interface and useful debugging tools for R. While other IDEs like Visual Studio Code are suitable for R, this tutorial is based on RStudio, and therefore will not include instructions for other IDEs. However, the concepts covered here can be adapted to other IDEs with minimal adjustments.

## Installing require libraries

There are two ways to install the require libraries. The first one is using the user interface of RStudio, and the second one is using the console.

### User interface of RStudio
Find the Packages tab on the right side of RStudio, then select the Packages tab to activate the Packages session. Click the Install button below, and the Install Packages dialog will be open.    
Then enter the Package names in the text box and click the Install button. Wait for a few moments, and the installation will be successful.

![](/public/images/Web%20Scraping%20in%20R/scraping_1.png "Install package in R")

For the first part of this tutorial, the package we need are `rvest` and `dplyr`. 

### Console

Run the `install.packages()` command in the console. Here is an example to install the `rvest` package and `dplyr` package.

```
# install packages
install.packages("rvest")
install.packages("dplyr")
```

# Start web scraping

Before we start web scraping, we need to find out whether the page we are scraping is a static page or a dynamic page. The main difference between a static page and a dynamic site is that a static page displays fixed content, while a dynamic site provides more personalized and interactive content to suit the needs and actions of the user. This difference has implications for web scraping, as the techniques used to scrape static pages may not be applicable to dynamic sites that require a more sophisticated approach.

## Static pages scraping with rvest

In this example, we want to scrape [the top 250 Movies in IMDB](https://www.imdb.com/chart/top/?ref_=nv_mv_250). And we will be scraping the 4 elements (Rank, Title, Year, and Rating) in this website.

![](/public/images/Web%20Scraping%20in%20R/IMDB_top250.png "IMDB Top 250")

**Step 1:** Begin with loading the rvest package by enter the following code.

```
# load the package
library(rvest)
library(dplyr)
```

**Step 2:** Save the website address into the url variable, then use the `read_html()` function to read the HTML code from the website then assign the result to the `document` variable.

```
# save the url
url <- "https://www.imdb.com/chart/top/?ref_=nv_mv_250"

# read the HTML code from the website
document <- read_html(url)
```

**Step 3:** Select the HTML elements.   
By watching the HTML code of the page, we can find that the title and year of the movie are stored in the td.titleColumn HTML element, and the corresponding Rating is stored in the td.ratingColumn.imdbRating HTML element.

![](/public/images/Web%20Scraping%20in%20R/html_1.png)

![](/public/images/Web%20Scraping%20in%20R/html_2.png)

Therefore, we use the following code to select them.

```
# selecting the list of movie HTML elements
html_movie <- document %>% html_elements("td.titleColumn")
html_rating <- document %>% html_elements("td.ratingColumn.imdbRating")
```

Looking further, we see that title is stored in `a`, year is stored in `span`.secondaryInfo, and rating information is stored in `strong`.    
Therefore, we use the following code to select these nodes we need.

```
# selecting the "a" HTML element from html_movie storing the movie title
title_element <- html_movie %>% html_elements("a")

# selecting the "span.secondaryInfo" HTML element from html_movie storing the years
year_element <- html_movie %>% html_elements("span.secondaryInfo")

# selecting the "strong" HTML element from html_rating storing the rating
rating_element <- html_rating %>% html_elements("strong")
```

**Step 4:** Use the following code to extract the corresponding data from the HTML element.

```
# extracting data from the list of movies and storing the scraped data into 3 lists
movie_title <- title_element %>% html_text2()
movie_year <- year_element %>% html_text2()
movie_rating <- rating_element %>% html_text2()
```

Since the data we need is stored as text in HTML elements, we can use `html_text2()` to extract this text directly.   
At this point, we get three data: `movie_title`, `movie_year`, `movie_rating`, and now we put them together with `data.frame` and change their column name using `names()`. 

```
# converting the lists containg the scraped data into a dataframe
movies <- data.frame(
  movie_title,
  movie_year,
  movie_rating
)

# changing the column names of the data frame before exporting it into CSV
names(movies) <- c("Title", "Year", "IMDB Rating")
```

However, we look at the table and find that there is no Rank, so we add a Rank in the first column of the table.

```
# add the rank number, and put them to the first row
movies$Rank=1:nrow(movies)
movies <- movies %>% select(Rank,Title,Year,`IMDB Rating`)
```

**Step 5:** Export the scraped data as a CSV file   
Using `write.table()` method to export the data, and store into IBDB_Movie_Rating.csv.

```
# export the data frame containing the scraped data to a CSV file
write.table(movies, file = "IBDB_Movie_Rating.csv", sep =",", row.names = F, col.names = T)
```

## Dynamic Pages scraping with RSelenium

While the rvest library is an excellent tool for crawling most static pages, it may not be the best option for dynamic pages. To handle dynamic page crawling, many R users turn to the RSelenium library. Therefore, in this tutorial, we will be using RSelenium as an example to demonstrate its capabilities.

**Step 1:** Install the RSelenium package and load it   
You can use the RStudio User interface as explain in the first section in the tutorial. Here we use the console as the example. 

```
# install package
install.packages("RSelenium")
# load package
library(RSelenium)
library(dplyr)
```

**Step 2:** Starting Selenium  
In this tutorial, I start the Selenium server using Docker and connect it using RSelenium. First, download Docker and run the following command from the terminal.

```
docker run -d -p 4445:4444 selenium/standalone-firefox
```

This command will download a latest Firefox and start a container. Once the server start, use the following code in RStudio to connect the server.

```
# start RSelenium service 
remDr <- remoteDriver(
  remoteServerAddr = "localhost",
  port = 4445L,
  browserName = "firefox"
)
remDr$open()
```

While the connect successfully, use `navigate()` function to navigate to the URL.

```
# navigate to the URL
remDr$navigate("https://www.imdb.com/chart/top/?ref_=nv_mv_250")
```

**Step 3:** Scraping the data  
Create 3 lists to store the movies title, year, and rating.

```
# Create list to store titles, years, and ratings
movie_titles <- list()
movie_years <- list()
movie_rating <- list()
```

To locate the HTML elements, use `findElements()` function. This function is highly adaptable and capable of operating with a variety of methods, including CSS Selectors, XPath, and even specific attributes like id, name, and tag name. Here, we use CSS Selectors to locate it.

```
# iterating all movie HTML element and rating HTML element
html_movies <- remDr$findElements(using = "css selector", value = "td.titleColumn")
html_ratings <- remDr$findElements(using = "css selector", value = "td.ratingColumn.imdbRating")
```

Since, the data we need all store as text, so we can use `getElementText()` function to get the text from the HTML element. It can be done as follows:

```
# scraping the data from each movie
for (html_movie in html_movies) {
  movie_titles <- append(
    movie_titles,
    html_movie$findChildElement(using = "css selector", value = "a")$getElementText()[[1]] 
  )

  movie_years <- append(
    movie_years,
    html_movie$findChildElement(using = "css selector", value = "span.secondaryInfo")$getElementText()[[1]]
  )
}

for (html_rating in html_ratings) {
  movie_rating <- append(
    movie_rating,
    html_rating$findChildElement(using = "css selector", value = "strong")$getElementText()[[1]]
  )
}
```

**Step 4:** unlist the 3 list, then use `data.frame()` function to containing the data. Then same as above use `names()` to change the column names.

```
# converting the lists containg the scraped data into a dataframe
movies <- data.frame(
  unlist(movie_titles),
  unlist(movie_years),
  unlist(movie_rating)
)

# changing the column names of the data frame before exporting it into CSV
names(movies) <- c("Title", "Year", "IMDB Rating")
```

**Step 5:** Then add the rank column, and save them as a CSV file, which is the same as above using rvest. Then there will have a IBDB_Movie_Rating.csv file store the scraping data.

```
# add the rank number, and put them to the first row
movies$Rank=1:nrow(movies)
movies <- movies %>% select(Rank,Title,Year,`IMDB Rating`)
# export the data frame containing the scraped data to a CSV file
write.table(movies, file = "IBDB_Movie_Rating.csv", 
            sep =",", row.names = F, col.names = T)
```

Now, you know how to use rvest package and RSelenium package to do the web scraping in R.

# Online Resources

https://www.zenrows.com/blog/web-scraping-r#web-scraping-with-a-headless-browser-in-r

https://www.youtube.com/watch?v=Dkm1d4uMp34
# Lab Tasks

- Questions that you need to answer can be found in [ANSWERS.md](./ANSWERS.md).
- Tasks that specify work to do without a written response will be bulleted.

If you're ever confused about what you need to do for a given task, ask.

<!-- TOC depthFrom:1 depthTo:8 withLinks:1 updateOnSave:1 orderedList:0 -->
## Table of Contents

- [Exploring the Project](#exploring-the-project)
  - [Exploring the server](#exploring-the-server)
- [More Todos!](#more-todos)
  - [Writing Todos to the Database](#writing-todos-to-the-database)
  - [Summary Information About ToDos](#summary-information-about-todos)
  - [Make it pretty](#make-it-pretty)
- [Remember to test!](#remember-to-test)
  - [Client-side testing](#client-side-testing)
  - [Server-side testing](#server-side-testing)

<!-- /TOC -->

## Exploring the project

The structure of this project should be nearly identical to that of lab #3, and as such there really isn't much excitement in that department.

### Exploring the server

The server is, for the most part, the same as it has been in the past two labs. The difference to look for here is in how the server gets the data it sends out in reply to requests.

Answer questions 1-6 in [ANSWERS.md](./ANSWERS.md).

## More Todos!
- Re-implement the ToDo API, this time pulling data from MongoDB rather than from a flat JSON file.
- When displaying the ToDos in your Angular front-end, make thoughtful decisions about whether work like filtering should be done in Angular or via database queries. It would be reasonable, for example, to have the database filter out all the ToDos belonging to a single user, but let Angular filter by category or status.

### Writing Todos to the Database
- We have included an example of writing to the database with `addUser` functionality. Add to both the front-end and back-end to make it possible to add ToDos so that they appear both in your list and in the database.

### Summary Information About ToDos

To see an example of using the database and the server to do some useful work
(instead of having everything happen in Angular), implement an API endpoint
`/api/todoSummary` which provides summary information about a group of
ToDos in the following format:

````
{
  percentToDosComplete: Float,
  categoriesPercentComplete: {
    groceries: Float,
    ...
  }
  ownersPercentComplete: {
    Blanche: Float,
    ...
  }
}
````

So you should add a new endpoint to your Spark routes, and then have that call
some method (possibly in a new class?) that queries the DB for the relevant data
and assembles this JSON response. Note that you can use
[MongoDB aggregation](http://mongodb.github.io/mongo-java-driver/3.4/driver/tutorials/aggregation/)
to do most of this calculation without having to actually download all the todos,
organize, and count them yourself.

### Make it pretty

- Use the Angular Material Design tools you've learned about to build a nice interface for
accessing these APIs:
  - You must use at least two of the following nifty Angular Material features:
  - There are so many too choose from just explore them [here](https://material.angular.io/components/categories)!


## Remember to test!

Test test and more test! Your project again should have tests. You should continue expanding  upon your previous end-to-end test as well as implement Unit Test for both your client-side **and**
the server-side.

### Client-side testing
- The gradle task [_runClientTestsWithCoverage_](#readme) will be extremely useful to see how covered your client-side is by test.

- Continue expanding upon your `TESTCOVERAGE.md` file with any additional end-to-end test added.


### Server-side testing
- Remember to add JUnit Test as you re-implement your ToDo API.

>:exclamation:Pro-Tip: Test Coverage can be produced on IntelliJ as well! Go to to your server test folder and Right-click on the _test_ folder and select **Run 'All Test' with Coverage** which will then provide a report of coverage in your server code in the side bar.

>Additionally you can Right-click, select _Analyze_ -> _Generate Coverage Report..._ which will prompt you for an output directory and give you the option to view the report an HTML report in a browser.  


[readme]:https://github.com/UMM-CSci-3601/3601-lab4_mongo_db/#testing-and-continuous-integration

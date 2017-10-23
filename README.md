# Compository

Compository is a web application that allows users to compare the activity of GitHub repositories.

If you hesitate between several different librairies to use in your projects, Compository will
help you make a choice by showing you which GitHub repositories are the more active, and by comparing
side by side their statistics. It will also help you exclude dead software from your options.

## Build

Our build process is quite simple. It triggers the ESLint tests to validate js files.

```bash
npm run build
```


## Installation

**Docker**

```
$ git clone https://github.com/mathieumonteverde/compository.git
$ cd compository
$ cd docker
$ docker-compose up --build
```

Prerequisites for Docker:
+ [Docker](https://www.docker.com/get-docker)
+ [Docker Compose](https://docs.docker.com/compose/install/)

You can now access to the application via: [http://localhost:9090](http://localhost:9090)

## Criteria & Features

Here's the list of implemented features, and criteria that have been respected.

### Mandatory 
- [x] **The app is online and publicly available**

The application is online and available at [https://compository.herokuapp.com/](https://compository.herokuapp.com/).


- [x] **Someone arriving on the app, without prior knowledge of the project, understands what it is about and can use it.**

The purpose of the application is well explained on the home page, and we made sure to make the UI and UX as efficient and user-friendly as possible.


- [x] **The app uses a nice visual template.**

Home made, with love. It's based on the bootstrap framework and we put extra effort on the side by side comparison UI.


- [x] **There is a repo with a README.md file that explains what the project is about, how to run it locally and how to build it.**

Obviously.


- [x] **The build process invokes a linter. The linter is happy with the quality of your code (no error).**

Yes of course, you can try with the following command :

```bash
npm run build
```


- [x] **The app fetches data from GitHub and presents it in the UI.**

Yes, yes it does.


- [x] **The app works (no crash, no obvious problem in the interactivity, etc.)**

The app works fine, as far as we're aware of.


### Extra 

- [x] **It is possible to test the app locally, with a docker-compose up.**

Please refer to the Installation section above.


- [x] **Extra effort has been put in the UI/UX.**

As mentionned above, we put extra effort in the UI/UX of the side by side comparison of github repositories. 
The user can easily sort the repositories according to different criteria, and the application allows to quickly 
understand the many differences between each one of the repositories.

We think we made an application that allows the user to efficiently compare repositories and determine
the more active ones to use in his own projects.


- [x] **There is something else that you have done and that you think deserves a bonus.**

### PlanetChart plugin

At some point in our life we got tired of bar graphs to compare different entities on the same key features.

This is why we developped our own chart plugin for this project. It is called PlanetChart.js, and it's used
to make a visual comparison of the GitHub analytics on the comparison page of the application. 

It displays entities as "planets" orbiting around a "sun", and one can map key features of said entities 
to the size, speed and distance of the planets. In our project, for each repository, we mapped the last update
date to the distance of the planet from the origin, the number of contributors to the size of the planet,
and the number of commits to the speed of the planet. Thus, to find out which one is more active, we can 
search for the biggest, fastest, - closest to the center - planet and there we have it !

To be honest, the plugin could be improved and maybe we'll have this opportunity in the two next projects
to expand its possibilities. Nonetheless, we worked hard on this one, and given the amount of time at our disposition,
we would be happy to unlock an extra credit for this feature !




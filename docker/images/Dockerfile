FROM node:8.6.0
MAINTAINER $'Kirushnapillai Sathiya <sathiya.kirushnapillai@heig-vd.ch> \n\
             Monteverde Mathieu <mathieu.monteverde@heig-vd.ch>'

COPY ["githubapi.js", "main.js", "package.json", "/opt/app/"]
COPY ["views", "/opt/app/views/"]

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/main.js"]

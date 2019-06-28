FROM nginx
# Want to copy our default.conf file on top of the one already there
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/html/css
RUN mkdir -p /etc/nginx/html/images
RUN mkdir -p /etc/nginx/html/js
RUN cd /etc/nginx/html
WORKDIR /etc/nginx/html/css
COPY ./css/* ./
WORKDIR  /etc/nginx/html/images
COPY ./images/* ./
WORKDIR /etc/nginx/html/js
COPY ./js/* ./

FROM node:10 as build

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

CMD ["npm", "start"]

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/default.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

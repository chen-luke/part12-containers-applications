# The starting stage of cleaning installation
FROM node:20 AS base-stage
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
COPY . .


# Build stage
FROM base-stage AS build-stage
RUN npm run build

# RUN npm install -g serve

# CMD [ "serve", "dist" ]

# This is a new stage, everything before this is gone, except for the files that we want to COPY
FROM nginx:1.25-alpine

# COPY the directory dist from the build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html


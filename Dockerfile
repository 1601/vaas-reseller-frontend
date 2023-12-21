# Build stage
FROM node:14-alpine as build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY src/ ./

# Ensure the 'dist' and 'fonts' directories are properly copied here
COPY src/dist ./dist
COPY src/fonts ./fonts

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove the default Nginx static content and Nginx configuration

RUN rm -rf /usr/share/nginx/html/*

# Copy the build files from the build stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copying the 'dist' and 'fonts' folders
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/dist
COPY --from=build /usr/src/app/fonts /usr/share/nginx/html/fonts

# Set the correct permissions for all files and directories
RUN chmod -R 755 /usr/share/nginx/html

# Copy additional Nginx configuration if needed
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy Nginx health and status configurations
COPY nginx/health /usr/share/nginx/html/health
COPY nginx/nginx_status/index.html /usr/share/nginx/html/nginx_status/index.html

# Set the correct permissions for the health and nginx_status files
RUN chmod 644 /usr/share/nginx/html/health /usr/share/nginx/html/nginx_status/index.html

# Expose the port that Nginx will listen on (default is 80)
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]

# Use AWS Lambda’s Node.js base image
FROM public.ecr.aws/docker/library/node:current-alpine3.23

# Set working directory
WORKDIR /app  

# Copy package.json and install dependencies
COPY package.json package-lock.json .  
RUN npm install  

# Copy app files
COPY . .  

# Add AWS Lambda Web Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=3000

# Expose port 3000
EXPOSE 3000  

# Start the app
CMD ["node", "server.js"]
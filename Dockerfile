
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app will run on
EXPOSE 5000


# Gosia Test Task

## Description

This project is designed to showcase a distributed system involving a frontend, backend, message queue, and a database. The system is used to send a large number of emails in an efficient and scalable way, while also providing real-time feedback to the user on the status of the email sending process.

## Installation

1. Clone the repository.
2. Install Docker on your machine. Follow the instructions from the official Docker site according to your OS.
3. Build and run the application with Docker Compose command:  
   `docker-compose build && docker-compose up -d`

4. Wait for Docker to initialize all the containers. This may take several minutes depending on your machine's performance.

`Note: For a correct initialization, make sure the MySQL container is fully running before starting the server container.`

## Running the Application

Once the Docker Compose process has finished and all the containers are up and running, you can start the server container. If you're not sure whether the MySQL container is fully initialized, you might need to restart the server container:

`docker restart your_server_container`

Remember to replace your_server_container with the name of your server container.

## License

This project is licensed under the MIT License.

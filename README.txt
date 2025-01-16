1. **Install MongoDB Locally**:
   - Download and install MongoDB Community Edition from the [MongoDB Website](https://www.mongodb.com/try/download/community).
   - Follow the installation instructions for your operating system.

2. **Start MongoDB**:
   - Ensure the MongoDB server is running by executing:
     ```bash
     mongod
     ```

3. **Restore the Database**:
   - Use the `mongorestore` command to import the database from the `dump/` folder:
     ```bash
     mongorestore --db your-database-name dump/your-database-name
     ```
   - Replace `your-database-name` with the actual name of the database.

4.  Create the .env File
	The .env file is required to configure essential project settings, such as the database connection, server port, and authentication keys. Follow these steps:

	In the project root directory (same level as server.js), create a new file named .env.

	Open the .env file in a text editor and add the following variables:

	env
	Copy code
		PORT=3000
		MONGO_URI=mongodb://localhost:27017/your-database-name
		JWT_SECRET=your-secret-key
		PORT:
	This specifies the port on which the application will run.
	Default is 3000, but you can change it if needed (e.g., 4000).
	MONGO_URI:
		The MongoDB connection string. Since the database is local, use: env
	Copy code
		MONGO_URI=mongodb://localhost:27017/your-database-name
	Replace your-database-name with the name of the restored database (e.g., web-development).
	JWT_SECRET:
		This is a secret key for JSON Web Token (JWT) authentication. Replace your-secret-key with a secure, unique string. For example: env
	Copy code
		JWT_SECRET=mySuperSecureKey123!
	Save the .env file.

5. Verify the .env file is in the root directory of the project.

 **Verify the Database Connection**:
   - Run the application (`npm start`) and ensure the server connects to the database without issues.
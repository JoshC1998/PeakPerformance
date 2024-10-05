PeakPerformance :

This application allows users to sign up, log in, and submit workouts, including bench press, squat, deadlift, push-ups, and pull-ups, to be added to a leaderboard. Users can track their progress, view their rankings, and access personalized workout and meal plans.

Features :

User Authentication: Sign up and log in functionality using Flask.

Workout Submission: Submit different workouts and track your results.

Video Uploads: Upload workout videos, stored securely on Cloudinary.

Personalized Plans: Fetch workout or meal plans based on weight and various other criteria using OpenAI.
Progress Tracking: Generate and view graphs to track your progress over time.

Leaderboard: View the top scores for each workout and compare your performance with others.
Project Structure

This project uses a Flask backend and a Vite-powered frontend.

Make sure you have the following installed:

Python 3.x
pipenv (Python dependency management)
Node.js and npm
Backend Setup (Flask)

Clone the repository:

Copy code
git clone https://github.com/yourusername/your-repo.git
cd your-repo
Navigate to the server directory and install the backend dependencies:

pipenv install
pipenv shell
cd server

Initialize and migrate the database:

flask db init
flask db migrate -m "Initial migration"
flask db upgrade

Run the Flask application:

python app.py
Frontend Setup (Vite)
Navigate to the client directory and install the frontend dependencies:

bash
Copy code
npm install --prefix client

Run the frontend development server:

npm run dev --prefix client

Data Storage:

The application uses SQL for data storage, with the backend handling data models and interactions using Flask's model frameworks like SQLAlchemy. This allows for structured data storage and easy querying of workout records, user details, and leaderboard information.

Contributions are welcome! Please feel free to open an issue or submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for more details.
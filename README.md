# Workout Leaderboard Application

This application allows users to sign up, log in, and submit workouts, including bench press, squat, deadlift, push-ups, and pull-ups, to be added to a leaderboard. Users can track their progress, view their rankings, and access personalized workout and meal plans.

## Features

- **User Authentication**: Sign up and log in functionality using Flask.
- **Workout Submission**: Submit different workouts and track your results.
- **Video Uploads**: Upload workout videos, stored securely on Cloudinary.
- **Personalized Plans**: Fetch workout or meal plans based on weight and various other criteria using OpenAI.
- **Progress Tracking**: Generate and view graphs to track your progress over time.
- **Leaderboard**: View the top scores for each workout and compare your performance with others.

## Project Structure

This project uses a Flask backend and a Vite-powered frontend.

. ├── client/ # Frontend code (React, Vite) ├── server/ # Backend code (Flask) ├── README.md ├── Pipfile # Python dependencies for Flask ├── Pipfile.lock ├── package.json # npm dependencies for Vite └── ...

markdown
Copy code

## Setup and Installation

### Prerequisites

Make sure you have the following installed:

- Python 3.x
- pipenv (Python dependency management)
- Node.js and npm

### Backend Setup (Flask)

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/your-repo.git
    cd your-repo
    ```

2. Navigate to the `server` directory and install the backend dependencies:

    ```bash
    pipenv install
    pipenv shell
    cd server
    ```

3. Initialize and migrate the database:

    ```bash
    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade
    ```

4. Run the Flask application:

    ```bash
    python app.py
    ```

### Frontend Setup (Vite)

1. Navigate to the `client` directory and install the frontend dependencies:

    ```bash
    npm install --prefix client
    ```

2. Run the frontend development server:

    ```bash
    npm run dev --prefix client
    ```

### Access the Application

- **Backend**: By default, the Flask backend runs at [http://127.0.0.1:5000](http://127.0.0.1:5000).
- **Frontend**: By default, the Vite frontend runs at [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Data Storage

The application uses SQL for data storage, with the backend handling data models and interactions using Flask's model frameworks like SQLAlchemy. This allows for structured data storage and easy querying of workout records, user details, and leaderboard information.

## How to Use

1. **Sign Up / Login**: Create a new account or log in with an existing account.
2. **Submit Workouts**: Choose from a variety of workouts (bench press, squat, deadlift, push-ups, pull-ups) and submit your performance along with optional video uploads.
3. **View Leaderboard**: Check your position on the leaderboard and see how you compare with other users.
4. **Get Personalized Plans**: Use OpenAI to generate personalized workout or meal plans based on your weight and other criteria.
5. **Track Your Progress**: Generate and view graphs to keep track of your improvement over time.

## Technologies Used

- **Backend**: Flask, SQLAlchemy
- **Frontend**: React, Vite
- **Database**: SQL (SQLite by default, can be configured to use PostgreSQL or MySQL)
- **Authentication**: Flask-Login
- **Video Storage**: Cloudinary
- **Personalized Plan Generation**: OpenAI API

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
import os
from flask import Flask, request, session, jsonify, make_response
from werkzeug.security import generate_password_hash
from models import User
from config import app, db, bcrypt
from sqlalchemy.exc import IntegrityError
import cloudinary
import cloudinary.uploader
from flask_cors import CORS

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Initialize CORS
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Temporary in-memory storage for lifts
submitted_lifts = []

@app.post('/api/users')
def create_user():
    data = request.json
    print(f"Creating user with data: {data}")
    
    try:
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user:
            print("Username already exists")
            return {'error': 'Username already exists'}, 409

        new_user = User(username=data['username'])
        new_user.password = data['password']
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        response = make_response(jsonify(new_user.to_dict()), 201)
        response.set_cookie('session', str(new_user.id), samesite='Lax', secure=True, httponly=True)
        return response
    except IntegrityError:
        db.session.rollback()
        print("IntegrityError: Username already exists")
        return {'error': 'Username already exists'}, 409
    except Exception as e:
        print(f"Exception occurred: {e}")
        return {'error': str(e)}, 406

@app.get('/api/check_session')
def check_session():
    user_id = session.get('user_id')
    print(f"Checking session for user_id: {user_id}")
    
    if user_id:
        user = User.query.filter_by(id=user_id).first()
        if user:
            return jsonify(user.to_dict()), 200
    return jsonify({}), 204

@app.post('/api/login')
def login():
    data = request.json
    print(f"Received login request with data: {data}")
    
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        print("User not found")
        return {'error': 'Invalid username or password'}, 401

    if user.authenticate(data['password']):
        session['user_id'] = user.id
        response = make_response(jsonify(user.to_dict()), 200)
        response.set_cookie('session', str(user.id), samesite='Lax', secure=True, httponly=True)
        return response
    else:
        print("Authentication failed")
        return {'error': 'Invalid username or password'}, 401

@app.delete('/api/logout')
def logout():
    session.pop('user_id', None)
    response = make_response({}, 204)
    response.delete_cookie('session')
    return response

@app.post('/upload')
def upload_video():
    if 'video' not in request.files:
        return {'error': 'No file part'}, 400

    file = request.files['video']
    if file.filename == '':
        return {'error': 'No selected file'}, 400

    try:
        result = cloudinary.uploader.upload(file, resource_type='video')
        return jsonify({'url': result['secure_url']}), 200
    except Exception as e:
        print(f"Exception occurred during file upload: {e}")
        return {'error': str(e)}, 500

@app.route('/api/lifts', methods=['OPTIONS'])
def options():
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

@app.get('/api/lifts')
def get_lifts():
    # Return the list of submitted lifts
    return jsonify(submitted_lifts), 200

@app.post('/api/lifts')
def submit_lift():
    data = request.json
    print(f"Received lift data: {data}")  # Debugging line
    
    if 'videoUrl' not in data or 'liftName' not in data or 'user' not in data:
        return {'error': 'Missing required fields'}, 400

    # Validate liftName
    if data['liftName'] not in ['Bench', 'Deadlift', 'Squat', 'Push-ups', 'Pull-ups']:
        return {'error': 'Invalid lift name'}, 400

    # Validate weight or reps based on lift type
    if data['liftName'] in ['Bench', 'Deadlift', 'Squat'] and 'weight' not in data:
        return {'error': 'Missing weight for lift'}, 400
    if data['liftName'] in ['Push-ups', 'Pull-ups'] and 'reps' not in data:
        return {'error': 'Missing reps for lift'}, 400

    # Add the lift data to the list
    submitted_lifts.append({
        'user': data['user'],
        'liftName': data['liftName'],
        'weight': data.get('weight'),
        'reps': data.get('reps'),
        'videoUrl': data['videoUrl']
    })
    return {'message': 'Lift submitted successfully'}, 201

if __name__ == '__main__':
    app.run(port=5555, debug=True)
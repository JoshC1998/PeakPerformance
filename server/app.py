import os
from flask import Flask, request, session, jsonify
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

@app.post('/api/users')
def create_user():
    data = request.json
    try:
        new_user = User(username=data['username'])
        new_user.password = generate_password_hash(data['password'])
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return new_user.to_dict(), 201
    except IntegrityError:
        db.session.rollback()
        return {'error': 'Username already exists'}, 409
    except Exception as e:
        return {'error': str(e)}, 406

@app.get('/api/check_session')
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.filter_by(id=user_id).first()
        if user:
            return jsonify(user.to_dict()), 200
    return jsonify({}), 204

@app.post('/api/login')
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.authenticate(data['password']):
        session['user_id'] = user.id
        return user.to_dict(), 200
    else:
        return {'error': 'Invalid username or password'}, 401

@app.delete('/api/logout')
def logout():
    session.pop('user_id', None)
    return {}, 204

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
        return {'error': str(e)}, 500

# Handle CORS preflight requests for /api/lifts
@app.route('/api/lifts', methods=['OPTIONS'])
def options():
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

# Add POST method for /api/lifts
@app.post('/api/lifts')
def submit_lift():
    data = request.json
    if 'videoUrl' not in data:
        return {'error': 'Missing video URL'}, 400
    # Process the lift data here
    return {'message': 'Lift submitted successfully'}, 201

if __name__ == '__main__':
    app.run(port=5555, debug=True)
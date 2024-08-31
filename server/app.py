from flask import Flask, request, session, jsonify
from werkzeug.security import generate_password_hash
from models import User
from config import app, db, bcrypt
from datetime import datetime
from sqlalchemy.exc import IntegrityError

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
            return user.to_dict(), 200
    return {}, 204

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

@app.get('/')
def index():
    pass

if __name__ == '__main__':
    app.run(port=5555, debug=True)
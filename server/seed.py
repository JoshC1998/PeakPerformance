#!/usr/bin/env python3

from config import app, db
from models import User 
from random import randint, choice as rc
from faker import Faker
from app import app
from models import db
from datetime import datetime


fake = Faker()

def seed_database():
    with app.app_context():
        User.query.delete()

        db.session.commit()


        print("Adding new data...")


        users = [User(username=fake.user_name(), password=fake.password()) for _ in range(5)]
        db.session.bulk_save_objects(users)
        db.session.commit()  # Commit to save users

        db.session.commit()
        print("Seeding complete!")

if __name__ == '__main__':
    seed_database()
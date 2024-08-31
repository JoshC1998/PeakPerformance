from sqlalchemy.orm import validates 
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, bcrypt 
from datetime import datetime
from sqlalchemy import Column, Integer, Date, String

class User(db.Model, SerializerMixin):

  __tablename__ = 'users_table'

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String, unique=True, nullable=False)
  password_hash= db.Column(db.String, nullable=False)
 
  serialize_rules = ("-password_hash",)

  @property
  def password(self): 
      raise Exception("Safety First")
    
  @password.setter
  def password(self, value): 
      self.password_hash = bcrypt.generate_password_hash(value).decode('utf-8')

  def authenticate(self, password_to_check): 
      return bcrypt.check_password_hash(self.password_hash, password_to_check) 
  


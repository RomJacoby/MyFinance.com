from flaskBackend import db
class Stock(db.Model):
    name = db.Column(db.String(64), primary_key=True)
class Index(db.Model):
    name = db.Column(db.String(64), primary_key=True)
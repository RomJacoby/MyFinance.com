from flaskBackend import db
class Stock(db.Model):
    name = db.Column(db.String(64), index=True, primary_key=True)
    companyName = db.Column(db.String(64), index=True, unique=True)
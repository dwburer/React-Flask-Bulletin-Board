from index import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))

    def __init__(self, email, username, password):
        self.email = email
        self.active = True
        self.username = username
        self.password = User.hashed_password(password)

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None


class Post(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    location = db.Column(db.Integer, db.ForeignKey("location.id"), nullable=False)
    title = db.Column(db.String(255), unique=True)
    body = db.Column(db.String(255))

    def __init__(self, title, body, author_id, location):
        self.active = True
        self.title = title
        self.body = body
        self.author = author_id
        self.location = location


class Location(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), unique=True)

    def __init__(self, name):
        self.active = True
        self.name = name


class TagToPost(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    tag = db.Column(db.Integer, db.ForeignKey("tag.id"), nullable=False)
    post = db.Column(db.Integer, db.ForeignKey("post.id"), nullable=False)

    def __init__(self, name, color):
        self.active = True
        self.name = name
        self.color = color


class Tag(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), unique=True)
    color = db.Column(db.String(255), unique=True)

    def __init__(self, name, color):
        self.active = True
        self.name = name
        self.color = color

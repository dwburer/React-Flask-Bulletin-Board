from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, Post, Tag, TagToPost, Location
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/post", methods=["GET"])
def get_post():
    posts = Post.query.all()

    all_posts = []
    for p in posts:
        tag_bridges = TagToPost.query.filter_by(post=p.id)
        tags = [Tag.query.get(tag_bridge.tag) for tag_bridge in tag_bridges]
        location = Location.query.get(p.location)

        all_posts.append(
            {
                'id': p.id,
                'title': p.title,
                'body': p.body,
                'author': {
                    'username': User.query.get(p.author).username,
                    'email': User.query.get(p.author).email
                },
                'location': {
                    'name': location.name
                },
                'tags': [
                    {
                        'name': tag.name,
                        'color': tag.color
                    } for tag in tags
                ]
            }
        )

    return jsonify(all_posts)


@app.route("/api/create_post", methods=["POST"])
@requires_auth
def create_post():
    incoming = request.get_json()

    user = g.current_user
    new_post = Post(
        title=incoming['title'],
        body=incoming['body'],
        author_id=user['id'],
        location=incoming['location']
    )

    db.session.add(new_post)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Something went wrong trying to make a post, whoops."), 409

    return jsonify(message="Success"), 200


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        username=incoming["username"],
        password=incoming["password"]
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403

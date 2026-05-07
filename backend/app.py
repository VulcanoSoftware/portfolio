from datetime import timedelta

import logging
import pymongo
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "iousdfgboshIHGOUIBVNiughinbohn894hj8gfn!"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

logging.basicConfig(level=logging.INFO)

USERS = {"admin": "password"}

mongo_client = pymongo.MongoClient("mongodb://mongo:27017/db1")
db = mongo_client.db1

skills = db.skills
projects = db.projects
experiences = db.experiences
techstack = db.techstack


def error_response(message, status_code):
    return jsonify({"error": message}), status_code


def get_by_name_or_title(collection, field, value, not_found_message):
    item = collection.find_one({field: value})
    if not item:
        return None, error_response(not_found_message, 404)
    return item, None


def delete_by_field(collection, field, value, missing_message, not_found_message, success_message, response_key):
    if not value:
        return error_response(missing_message, 400)

    result = collection.delete_one({field: value})
    if result.deleted_count == 0:
        return error_response(not_found_message, 404)

    return jsonify({"message": success_message, response_key: value}), 200


def split_tags(raw_tags):
    if not raw_tags:
        return []
    return [tag.strip() for tag in raw_tags.split(",") if tag.strip()]


@app.route("/")
def home():
    current_host = request.url_root.replace(":5000/", "")
    return (
        f'<h3>Welcome to the api homepage</h3><br>'
        f'If you want to go to the actual website, click <a href="{current_host}:3000">here</a>.<br>'
        f'If you want to go to the api docs, click <a href="{current_host}:3000/api.html">here</a>.'
    )


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    if username not in USERS or USERS[username] != password:
        return jsonify({"msg": "Bad username or password"}), 401

    token = create_access_token(identity=username)
    return jsonify(access_token=token), 200


@app.route("/insertskill", methods=["GET", "POST"])
def insert_skill():
    skill = {
        "name": request.args.get("name"),
        "skillLevel": request.args.get("level"),
        "category": request.args.get("category"),
    }
    skills.insert_one(skill)
    return jsonify({"message": "Skill inserted successfully"}), 200


@app.route("/getskill", methods=["GET", "POST"])
def get_skill():
    name = request.args.get("name")
    item, error = get_by_name_or_title(skills, "name", name, "Skill not found")
    if error:
        return error

    return jsonify(
        {
            "name": item.get("name"),
            "skillLevel": item.get("skillLevel"),
            "category": item.get("category"),
        }
    ), 200


@app.route("/getallskills", methods=["GET", "POST"])
def get_all_skills():
    all_items = []
    for item in skills.find():
        all_items.append(
            {
                "name": item.get("name"),
                "skillLevel": item.get("skillLevel"),
                "skillCategory": item.get("category"),
            }
        )
    return jsonify(all_items), 200


@app.route("/deleteskill", methods=["GET", "POST"])
def delete_skill():
    return delete_by_field(
        collection=skills,
        field="name",
        value=request.args.get("name"),
        missing_message="Missing skill name",
        not_found_message="Skill not found",
        success_message="Skill deleted successfully",
        response_key="name",
    )


@app.route("/insertproject", methods=["GET", "POST"])
def insert_project():
    project = {
        "name": request.args.get("name"),
        "description": request.args.get("description"),
        "footer": request.args.get("footer"),
        "tags": split_tags(request.args.get("tags")),
        "image": request.args.get("image"),
    }
    projects.insert_one(project)
    return jsonify({"message": "Project inserted successfully"}), 200


@app.route("/getproject", methods=["GET", "POST"])
def get_project():
    name = request.args.get("name")
    item, error = get_by_name_or_title(projects, "name", name, "Project not found")
    if error:
        return error

    return jsonify(
        {
            "name": item.get("name"),
            "description": item.get("description"),
            "footer": item.get("footer"),
            "tags": item.get("tags", []),
            "image": item.get("image"),
        }
    ), 200


@app.route("/getallprojects", methods=["GET", "POST"])
def get_all_projects():
    all_items = []
    for item in projects.find():
        all_items.append(
            {
                "name": item.get("name"),
                "description": item.get("description"),
                "footer": item.get("footer"),
                "tags": item.get("tags", []),
                "image": item.get("image"),
            }
        )
    return jsonify(all_items), 200


@app.route("/deleteproject", methods=["GET", "POST"])
def delete_project():
    return delete_by_field(
        collection=projects,
        field="name",
        value=request.args.get("name"),
        missing_message="Missing project name",
        not_found_message="Project not found",
        success_message="Project deleted successfully",
        response_key="name",
    )


@app.route("/insertexperience", methods=["GET", "POST"])
def insert_experience():
    experience = {
        "title": request.args.get("title"),
        "role": request.args.get("role"),
        "period": request.args.get("period"),
    }
    experiences.insert_one(experience)
    return jsonify({"message": "Experience inserted successfully"}), 200


@app.route("/getexperience", methods=["GET", "POST"])
def get_experience():
    title = request.args.get("title")
    item, error = get_by_name_or_title(experiences, "title", title, "Experience not found")
    if error:
        return error

    return jsonify(
        {
            "title": item.get("title"),
            "role": item.get("role"),
            "period": item.get("period"),
        }
    ), 200


@app.route("/getallexperiences", methods=["GET", "POST"])
def get_all_experiences():
    all_items = []
    for item in experiences.find():
        all_items.append(
            {
                "title": item.get("title"),
                "role": item.get("role"),
                "period": item.get("period"),
            }
        )
    return jsonify(all_items), 200


@app.route("/deleteexperience", methods=["GET", "POST"])
def delete_experience():
    return delete_by_field(
        collection=experiences,
        field="title",
        value=request.args.get("title"),
        missing_message="Missing experience title",
        not_found_message="Experience not found",
        success_message="Experience deleted successfully",
        response_key="title",
    )


@app.route("/inserttech", methods=["GET", "POST"])
def insert_tech():
    name = request.args.get("name")
    label = request.args.get("label") or name
    alt = request.args.get("alt") or name

    tech = {
        "name": name,
        "label": label,
        "image": request.args.get("image"),
        "alt": alt,
    }
    techstack.insert_one(tech)
    return jsonify({"message": "Tech inserted successfully"}), 200


@app.route("/gettech", methods=["GET", "POST"])
def get_tech():
    name = request.args.get("name")
    item, error = get_by_name_or_title(techstack, "name", name, "Tech not found")
    if error:
        return error

    return jsonify(
        {
            "name": item.get("name"),
            "label": item.get("label"),
            "image": item.get("image"),
            "alt": item.get("alt"),
        }
    ), 200


@app.route("/getalltechstack", methods=["GET", "POST"])
def get_all_techstack():
    all_items = []
    for item in techstack.find():
        all_items.append(
            {
                "name": item.get("name"),
                "label": item.get("label"),
                "image": item.get("image"),
                "alt": item.get("alt"),
            }
        )
    return jsonify(all_items), 200


@app.route("/deletetech", methods=["GET", "POST"])
def delete_tech():
    return delete_by_field(
        collection=techstack,
        field="name",
        value=request.args.get("name"),
        missing_message="Missing tech name",
        not_found_message="Tech not found",
        success_message="Tech deleted successfully",
        response_key="name",
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

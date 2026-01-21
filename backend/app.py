from flask import Flask
from flask import request, jsonify
import pymongo
import logging
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "iousdfgboshIHGOUIBVNiughinbohn894hj8gfn!"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

USERS = {
    "admin": "password"
}

logging.basicConfig(level=logging.INFO)

mongoClient = pymongo.MongoClient("mongodb://mongo:27017/db1")
mongoDB = mongoClient.db1
skills = mongoDB.skills
projects = mongoDB.projects

@app.route("/")
def home():
    current_host = request.url_root.replace(":5000/", "")
    app.logger.info(current_host)
    return f'<h3>Welcome to the api homepage</h3><br>If you want to go to the actual website, click <a href="{current_host}:3000">here</a>.<br>If you want to go to the api docs, click <a href="{current_host}:3000/api.html">here</a>.'

@app.route('/login', methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    
    if username not in USERS or USERS[username] != password:
        return jsonify({"msg": "Bad username or password"}), 401
    
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

# nog beveiligen met een login
@app.route('/insertskill', methods=["GET", "POST"])
def urlInsertSkill():
    skillName = request.args.get('name')
    skillLevel = request.args.get('level')
    skillCategory = request.args.get('category')
    app.logger.info(skillName)
    skill = ({
        "name": skillName,
        "skillLevel": skillLevel,
        "category": skillCategory
    })
    skills.insert_one(skill)
    return jsonify({
        "message": "Skill inserted successfully"
    }), 200

@app.route('/getskill', methods=["GET", "POST"])
def urlGetSkill():
    skillName = request.args.get('name')
    skillObj = skills.find_one({"name": skillName})
    skill = ({
        "name": skillObj["name"],
        "skillLevel": skillObj["skillLevel"],
        "category": skillObj["category"]
    })
    return jsonify(skill), 200

@app.route('/getallskills', methods=["GET", "POST"])
def urlGetAllSkills():
    allSkills = []

    for skill in skills.find():
        allSkills.append({
            "name": skill.get("name"),
            "skillLevel": skill.get("skillLevel"),
            "skillCategory": skill.get("category")
        })

    return jsonify(allSkills), 200
    
# nog beveiligen met een login
@app.route('/deleteskill', methods=["GET", "POST"])
def urlDeleteSkill():
    skillName = request.args.get('name')
    
    if not skillName:
        return jsonify({"error": "Missing skill name"}), 400

    result = skills.delete_one({"name": skillName})

    if result.deleted_count == 0:
        return jsonify({"error": "Skill not found"}), 404

    return jsonify({
        "message": "Skill deleted successfully",
        "name": skillName
    }), 200
    
# nog beveiligen met een login
@app.route('/insertproject', methods=["GET", "POST"])
def urlInsertProject():
    projectName = request.args.get('name')
    projectDescription = request.args.get('description')
    projectFooter = request.args.get('footer')
    app.logger.info(projectName)
    project = ({
        "name": projectName,
        "description": projectDescription,
        "footer": projectFooter
    })
    app.logger.info(project)
    projects.insert_one(project)
    return jsonify({
        "message": "Skill inserted successfully"
    }), 200
    
@app.route('/getproject', methods=["GET", "POST"])
def urlGetProject():
    projectName = request.args.get('name')
    projectObj = projects.find_one({"name": projectName})
    app.logger.info(projectObj)
    project = ({
        "name": projectObj["name"],
        "description": projectObj["description"],
        "footer": projectObj["footer"]
    })
    return jsonify(project), 200

@app.route("/getallprojects", methods=["GET", "POST"])
def urlGetAllProjects():
    allProjects = []
    
    for project in projects.find():
        allProjects.append({
            "name": project.get("name"),
            "description": project.get("description"),
            "footer": project.get("footer")
        })

    return jsonify(allProjects), 200

# nog beveiligen met een login  
@app.route("/deleteproject", methods=["GET", "POST"])
def urlDeleteProject():
    projectName = request.args.get('name')
    
    if not projectName:
        return jsonify({"error": "Missing project name"}), 400

    result = projects.delete_one({"name": projectName})

    if result.deleted_count == 0:
        return jsonify({"error": "Project not found"}), 404

    return jsonify({
        "message": "Project deleted successfully",
        "name": projectName
    }), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
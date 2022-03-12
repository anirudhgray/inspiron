from flask import Flask, request, jsonify, json
from flask_cors import CORS
import pyrebase
from config import firebaseConfig
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'xec97xb2x8fxd9xd8xed}&sxdbxc0x86Vx87&xa5xcb'
CORS(app)

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()
storage = firebase.storage()


@app.route('/')
def home():
    return "API is UP and running"


@app.route('/user/login', methods=['POST'])
def login():
    if request.method == "POST":
        data = json.loads(request.data)
        email = data['email']
        password = data['password']
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            user['success'] = True
            return jsonify(user)
        except Exception as e:
            if "INVALID_PASSWORD" in str(e):
                return jsonify({'success': False, "error": "Invalid Password"})
            elif "EMAIL_NOT_FOUND" in str(e):
                return jsonify({'success': False, "error": "Invalid Email"})
            else:
                return jsonify({'success': False, "error": "Something went wrong"})


@app.route('/user/signup', methods=['POST'])
def signup():
    if request.method == "POST":
        data = json.loads(request.data)
        email = data['email']
        password = data['password']
        client = {"email": email, "name": data['name'], "user_type": data['user_type']}
        try:
            user = auth.create_user_with_email_and_password(email, password)
            user['success'] = True

            try:
                db.child("users").child(user['refreshToken']).push(client, user['idToken'])
            except Exception as e:
                return jsonify({'success': False, "error": "Something went wrong"})

            return jsonify(user)
        except Exception as e:
            if "EMAIL_EXISTS" in str(e):
                return jsonify({'success': False, "error": "Email already exists"})
            else:
                return jsonify({'success': False, "error": "Something went wrong"})


@app.route('/user/me', methods=['GET'])
def me():
    if request.method == "GET":
        data = json.loads(request.data)
        try:
            user = auth.refresh(data['refresh_token'])
            user_data = db.child("users").child(user['refreshToken']).get(user['idToken']).val()
            for value in user_data.values():
                user_data = value
            return jsonify({"success": True, "data": user_data})
        except Exception as e:
            print(e)
            return jsonify({'success': False, "error": "Something went wrong"})


@app.route("/courtcases", methods=['GET'])
def courtcases():
    data = json.loads(request.data)
    user = auth.refresh(data['refresh_token'])
    cases = db.child("cases").get(user['idToken']).val()
    return jsonify(cases)


@app.route("/courtcases/<case_id>", methods=['GET'])
def getcase(case_id):
    data = json.loads(request.data)
    user = auth.refresh(data['refresh_token'])
    case = db.child("cases").child(case_id).get(user['idToken']).val()
    return jsonify(case)


@app.route("/courtcases/<case_id>", methods=['GET','PATCH'])
def updatecase(case_id):
    if request.method == "PATCH":
        data = json.loads(request.data)
        case = {"case_name": data['case_name'],
                "judge_name": data['judge_name'],
                "prosecuting_party": data['prosecuting_party'],
                "defending_party": data['defending_party'],
                "prosecuting_lawyer": data['prosecuting_lawyer'],
                "defending_lawyer": data['defending_lawyer'],
                "time": data['time'],
                "status": data['status'],
                "case_type": data['case_type']}

        user = auth.refresh( data['refresh_token'])
        try:
            case_data = db.child("cases").child(case_id).update(case, user['idToken'])
            return jsonify(case_data)
        except Exception as e:
            return jsonify({'success': False, "error": "Something went wrong"})

    elif request.method == "GET":
        data = json.loads(request.data)
        user = auth.refresh(data['refresh_token'])
        case = db.child("cases").child(case_id).get(user['idToken']).val()
        return jsonify(case)


@app.route("/courtcases/count", methods=['GET'])
def count():
    pending = 0
    completed = 0
    data = json.loads(request.data)
    user = auth.refresh(data['refresh_token'])
    cases = db.child("cases").get(user['idToken']).val()
    for case in cases:
        sub_case = db.child("cases").child(case).get(user['idToken']).val()
        status = sub_case['status']
        if status == "active":
            pending += 1
        elif status == "completed":
            completed += 1
    return jsonify({"pending": pending, "completed": completed})


@app.route("/newcase", methods=['POST'])
def newcase():
    if request.method == "POST":
        data = json.loads(request.data)
        case = {"case_name": data['case_name'],
                "judge_name": data['judge_name'],
                "prosecuting_party": data['prosecuting_party'],
                "defending_party": data['defending_party'],
                "prosecuting_lawyer": data['prosecuting_lawyer'],
                "defending_lawyer": data['defending_lawyer'],
                "time": data['time'],
                "status": data['status'],
                "case_type": data['case_type']}

        user = auth.refresh( data['refresh_token'])
        try:
            case_data = db.child("cases").push(case, user['idToken'])
            return jsonify(case_data)
        except Exception as e:
            return jsonify({'success': False, "error": "Something went wrong"})


@app.route("/upload", methods=['POST'])
def upload():
    if request.method == "POST":
        # data = json.loads(request.data)
        file = request.files['file']
        # user = auth.refresh( data['refresh_token'])

        try:
            store = storage.child("cases").child(secure_filename(file.filename)).put(file)
            return jsonify(store)
        except Exception as e:
            print(e)
            return jsonify({'success': False, "error": "Something went wrong"})


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
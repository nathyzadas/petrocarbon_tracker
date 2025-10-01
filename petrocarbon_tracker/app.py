from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_folder='tracker/carbon_tracker/frontend/dist', static_url_path='/')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    carbon_footprint = db.Column(db.Float, default=0.0)
    points = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'carbon_footprint': self.carbon_footprint,
            'points': self.points
        }

class CarbonReductionPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plan_name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    estimated_reduction = db.Column(db.Float, nullable=False)
    is_completed = db.Column(db.Boolean, default=False)
    user = db.relationship('User', backref=db.backref('plans', lazy=True))

    def __repr__(self):
        return f'<CarbonReductionPlan {self.plan_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plan_name': self.plan_name,
            'description': self.description,
            'estimated_reduction': self.estimated_reduction,
            'is_completed': self.is_completed
        }

@app.route('/api')
def api_index():
    return 'Bem-vindo ao PetroCarbon Tracker API!'

# User CRUD
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/api/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

@app.route('/api/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.carbon_footprint = data.get('carbon_footprint', user.carbon_footprint)
    user.points = data.get('points', user.points)
    db.session.commit()
    return jsonify(user.to_dict())

@app.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

# Carbon Reduction Plan CRUD
@app.route('/api/plans', methods=['POST'])
def create_plan():
    data = request.get_json()
    new_plan = CarbonReductionPlan(
        user_id=data['user_id'],
        plan_name=data['plan_name'],
        description=data.get('description'),
        estimated_reduction=data['estimated_reduction']
    )
    db.session.add(new_plan)
    db.session.commit()
    return jsonify(new_plan.to_dict()), 201

@app.route('/api/plans', methods=['GET'])
def get_plans():
    plans = CarbonReductionPlan.query.all()
    return jsonify([plan.to_dict() for plan in plans])

@app.route('/api/plans/<int:id>', methods=['GET'])
def get_plan(id):
    plan = CarbonReductionPlan.query.get_or_404(id)
    return jsonify(plan.to_dict())

@app.route('/api/plans/<int:id>', methods=['PUT'])
def update_plan(id):
    plan = CarbonReductionPlan.query.get_or_404(id)
    data = request.get_json()
    plan.plan_name = data.get('plan_name', plan.plan_name)
    plan.description = data.get('description', plan.description)
    plan.estimated_reduction = data.get('estimated_reduction', plan.estimated_reduction)
    plan.is_completed = data.get('is_completed', plan.is_completed)
    db.session.commit()
    return jsonify(plan.to_dict())

@app.route('/api/plans/<int:id>', methods=['DELETE'])
def delete_plan(id):
    plan = CarbonReductionPlan.query.get_or_404(id)
    db.session.delete(plan)
    db.session.commit()
    return jsonify({'message': 'Plan deleted'})

# Chatbot AI
@app.route("/api/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_message = data.get("message", "").lower()
    response_message = "Desculpe, não entendi. Você pode perguntar sobre planos de redução de carbono ou como a IA pode ajudar na transição energética."

    if "plano de redução" in user_message or "reduzir carbono" in user_message:
        response_message = "Claro! Posso sugerir planos como: 1. Trocar rotas de transporte para opções mais eficientes. 2. Investir em energia renovável para sua casa ou empresa. 3. Otimizar o consumo de energia em equipamentos. Qual área você gostaria de explorar mais?"
    elif "energia renovável" in user_message:
        response_message = "A energia renovável, como solar e eólica, é crucial para a transição energética. Ela reduz a dependência de combustíveis fósseis e diminui as emissões de carbono. Quer saber mais sobre como implementá-la?"
    elif "inteligência artificial" in user_message or "ia" in user_message:
        response_message = "A IA pode analisar grandes volumes de dados para identificar padrões de consumo, otimizar rotas de transporte, prever a demanda de energia e sugerir as melhores estratégias para a redução de carbono."
    elif "olá" in user_message or "oi" in user_message:
        response_message = "Olá! Como posso ajudar você a reduzir sua pegada de carbono hoje?"

    return jsonify({"reply": response_message})

# Ranking (simplified for now)

@app.route('/api/ranking', methods=['GET'])
def get_ranking():
    users = User.query.order_by(User.points.desc()).all()
    return jsonify([user.to_dict() for user in users])

# Serve React App
@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    if request.path.startswith('/api'):
        return jsonify({'message': 'API endpoint not found'}), 404
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')


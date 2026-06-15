from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    """Renders the primary MindfulFlow user wellness dashboard."""
    return render_template('index.html')

@app.route('/api/wellness-tip')
def get_wellness_tip():
    """Returns a random micro-break wellness prompt to prevent digital burnout."""
    import random
    tips = [
        "Drop your shoulders and loosen your jaw. Take 3 deep breaths.",
        "Look away from the screen! Focus on an object 20 feet away for 20 seconds.",
        "Stand up and do a quick 30-second full-body stretch.",
        "Hydration check! Grab a sip of water before your next focus block."
    ]
    return jsonify({"tip": random.choice(tips)})

if __name__ == '__main__':
    app.run(debug=True)
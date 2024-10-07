from flask import Flask, render_template, request, redirect, url_for, send_file
from werkzeug.utils import secure_filename
import os
from PIL import Image
import time

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['OUTPUT_FOLDER'] = 'output/'
app.config['ALLOWED_EXTENSIONS'] = {'png'}
app.secret_key = 'keyyard_secret_key'

# Ensure upload and output directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

# Allowed file checker
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Image processing function
def process_skin(base_skin_path, customization_path, output_path):
    base_skin = Image.open(base_skin_path).convert("RGBA")
    customization = Image.open(customization_path).convert("RGBA")
    # Resize customization if needed
    if customization.size != base_skin.size:
        customization = customization.resize(base_skin.size, Image.NEAREST)
    # Combine images
    final_skin = Image.alpha_composite(base_skin, customization)
    final_skin.save(output_path)

# Home page route
@app.route('/')
def home():
    return render_template('home.html')

# Upload page route
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Check for uploaded file
        if 'skin' not in request.files:
            return redirect(request.url)
        file = request.files['skin']
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file(file.filename):
            # Save uploaded skin
            filename = secure_filename(file.filename)
            base_skin_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(base_skin_path)
            return redirect(url_for('select', filename=filename))
    return render_template('upload.html')

# Select page route
@app.route('/select/<filename>', methods=['GET', 'POST'])
def select(filename):
    if request.method == 'POST':
        # Get selected customization
        customization = request.form.get('customization')
        customization_path = os.path.join('static', 'assets', 'customizations', customization)
        # Generate unique output filename
        output_filename = f'final_skin_{int(time.time())}.png'
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        # Simulate processing delay
        time.sleep(2)
        # Process images
        base_skin_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        process_skin(base_skin_path, customization_path, output_path)
        return redirect(url_for('product', filename=output_filename))
    else:
        # Get list of customizations
        customizations = os.listdir(os.path.join('static', 'assets', 'ui'))
        return render_template('select.html', filename=filename, customizations=customizations)

# Product page route
@app.route('/product/<filename>')
def product(filename):
    return render_template('product.html', filename=filename)

@app.route('/download/<filename>')
def download(filename):
    try:
        file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
        return send_file(file_path, as_attachment=True)
    except FileNotFoundError:
        app.logger.error(f"File not found: {file_path}")
        return "File not found", 404
    except Exception as e:
        app.logger.error(f"Error downloading file: {e}")
        return "Internal Server Error", 500

# Shutdown route
@app.route('/shutdown', methods=['POST'])
def shutdown():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    return 'Server shutting down...'

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
import subprocess
import webview
import requests
import os

def download_complete():
    webview.windows[0].evaluate_js('alert("Download complete!");')

def save_file(filename, content):
    save_path = webview.windows[0].create_file_dialog(webview.SAVE_DIALOG, save_filename=filename)
    if save_path:
        with open(save_path, 'wb') as f:
            f.write(content)
        download_complete()

if __name__ == "__main__":

    webview.settings['ALLOW_DOWNLOADS'] = True

    # Start the Flask server in a separate process to avoid conflicts with the PyWebView window
    server = subprocess.Popen(["python", "server.py"])

    try:
        # Create a PyWebView window to display the UI 
        window = webview.create_window("Keyyard Halloween Skin Maker", "http://127.0.0.1:5000", width=800, height=600, resizable=True, js_api={'save_file': save_file})

        # Define a function to stop the Flask server
        def stop_flask_server(window):
            try:
                requests.post('http://127.0.0.1:5000/shutdown')
            except requests.exceptions.RequestException as e:
                print(f"Error shutting down the server: {e}")

        # Set the function to be called when the window is closed
        webview.start(stop_flask_server, window)

    finally:
        # Terminate the Flask server
        server.terminate()
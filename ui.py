import subprocess
import webview
import requests

if __name__ == "__main__":
    # Start the Flask server in a separate process to avoid conflicts with the PyWebView window
    server = subprocess.Popen(["python", "server.py"])

    try:
        # Create a PyWebView window to display the UI 
        window = webview.create_window("Keyyard Halloween Skin Maker", "http://127.0.0.1:5000", width=800, height=600, resizable=True)

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
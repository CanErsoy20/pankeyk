from app import create_app

app = create_app()

if __name__ == '__main__':
    print(f"Backend running on http://localhost:{app.config['PORT']}")
    app.run(host='0.0.0.0', port=app.config['PORT'])
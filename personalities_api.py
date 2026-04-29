# personalities_api.py
# API endpoints for Hermes Personalities and Virtual Office

import os
import yaml
from pathlib import Path
from starlette.responses import JSONResponse, HTMLResponse

async def route_personalities(request):
    """GET /api/personalities - Return Hermes personalities from config.yaml"""
    try:
        # Get config path from HERMES_HOME env (same as server.py)
        hermes_home = os.environ.get("HERMES_HOME", "/data/.hermes")
        config_path = os.path.join(hermes_home, "config.yaml")
        
        if not os.path.exists(config_path):
            return JSONResponse(
                {"success": False, "error": f"config.yaml not found at {config_path}"},
                status_code=404
            )
        
        # Read and parse config.yaml
        with open(config_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        # Extract personalities
        personalities = config.get('personalities', [])
        
        return JSONResponse({
            "success": True,
            "count": len(personalities),
            "personalities": personalities,
            "source": "hermes-config"
        })
    except Exception as e:
        return JSONResponse(
            {"success": False, "error": str(e)},
            status_code=500
        )


async def route_office(request):
    """GET /office* - Serve Virtual Office (Next.js static files)"""
    import mimetypes
    
    base_dir = Path(__file__).parent
    office_dir = base_dir / "virtual-office" / ".next" / "server" / "app"
    
    # If not built, return placeholder
    if not office_dir.exists():
        office_dir = base_dir / "virtual-office" / "src" / "app" / "office"
        if not office_dir.exists():
            html = """
            <!DOCTYPE html>
            <html lang="th">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Virtual Office - Building...</title>
                <style>
                    body { 
                        font-family: sans-serif; 
                        text-align: center; 
                        padding: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        min-height: 100vh;
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <h1>🏢 Virtual Office</h1>
                <p>Building... Please wait.</p>
            </body>
            </html>
            """
            return HTMLResponse(html)
    
    # Get the requested path
    path = request.path_params.get("path", "")
    
    # Map /office and /office/ to index.html
    if not path or path == "/":
        path = "index.html"
    elif path.endswith("/"):
        path = path + "index.html"
    
    # Handle Next.js special paths
    file_path = office_dir / path
    if not str(file_path).startswith(str(office_dir)):
        return JSONResponse({"error": "Forbidden"}, status_code=403)
    
    if file_path.is_dir():
        file_path = file_path / "index.html"
    
    # Try _next/static files
    if not file_path.exists():
        static_dir = base_dir / "virtual-office" / ".next" / "static"
        static_path = static_dir / path
        if static_path.exists():
            file_path = static_path
    
    # Try public folder
    if not file_path.exists():
        public_dir = base_dir / "virtual-office" / "public"
        public_path = public_dir / path
        if public_path.exists():
            file_path = public_path
    
    if file_path.exists() and file_path.is_file():
        content_type, _ = mimetypes.guess_type(str(file_path))
        return Response(
            content=file_path.read_bytes(),
            media_type=content_type or "application/octet-stream"
        )
    
    # Return 404
    return JSONResponse({"error": "Not found", "path": path}, status_code=404)

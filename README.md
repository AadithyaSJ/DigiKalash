# DigiKalash — Indian Heritage Conservation Project

A full-stack platform for showcasing and conserving Indian heritage: heritage sites & resources, events, a community forum, and a marketplace for artisans.

This repository contains:
- server/ — Django REST API (custom user model, JWT auth, heritage/forum/marketplace apps)
- client/ — React + Vite frontend (Tailwind CSS, axios API client with refresh-token logic)

---

## Tech stack (high level)
- Backend: Python, Django 5.x, Django REST Framework, djangorestframework-simplejwt (JWT), django-cors-headers, PostgreSQL, Pillow
- Frontend: React (v19), Vite, Tailwind (via @tailwindcss/vite), axios
- Development: local virtualenv, npm/yarn for client

---

## Table of contents
- Quick start
  - Backend (Django)
  - Frontend (React + Vite)
- Environment variables
- Authentication (JWT) & API examples
- Important endpoints & resources
- Database, media, static assets
- Tests & linting
- Deployment notes
- Contributing & troubleshooting
- Security & cleanup notes
- Useful commands (cheatsheet)

---

## Quick start

### Backend (development)
1. Create a Python virtual environment and activate it
   - Unix / macOS:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
   - Windows (PowerShell):
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```

2. Install Python dependencies
   - If `server/requirements.txt` exists:
     ```bash
     pip install -r server/requirements.txt
     ```
   - If not, install the core packages used by this project:
     ```bash
     pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary pillow
     ```
   - (Optional) freeze installed packages:
     ```bash
     pip freeze > server/requirements.txt
     ```

3. Configure environment variables (see next section). A simple local example uses PostgreSQL as configured in `server/core/settings.py`. You can also switch to SQLite for quick dev by editing `DATABASES` in `core/settings.py`.

4. Run migrations, create superuser, and start the server:
   ```bash
   cd server
   python manage.py migrate
   python manage.py createsuperuser  # follow prompts
   python manage.py runserver 0.0.0.0:8000
   ```
   - The Django admin will be available at: http://127.0.0.1:8000/admin/
   - Media files are served automatically when `DEBUG=True`.

Notes:
- `core/settings.py` currently contains a hard-coded SECRET_KEY and database credentials: replace these with environment variables before deploying.
- The Django REST Token endpoints are mounted in `core/urls.py`:
  - POST  /api/token/         (obtain pair: access + refresh)
  - POST  /api/token/refresh/ (refresh access token)

---

### Frontend (development)
1. Change into the client folder and install dependencies:
   ```bash
   cd client
   npm install
   # or
   yarn
   ```

2. Start the Vite dev server:
   ```bash
   npm run dev
   # default served at http://localhost:5173
   ```

3. Connect frontend ↔ backend:
   - The frontend currently uses `client/src/api.js` with a hard-coded base URL:
     ```js
     baseURL: 'http://127.0.0.1:8000/',
     ```
   - Recommended: change to an environment variable approach so builds can target different backends:
     - Update `client/src/api.js` to use Vite env:
       ```js
       const API = axios.create({
         baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/',
       });
       ```
     - Start dev server with the env var:
       ```bash
       # .env file at client/.env
       VITE_API_BASE_URL=http://127.0.0.1:8000/
       ```
     - Vite injects `import.meta.env.VITE_*` at build time.

4. Build for production:
   ```bash
   npm run build
   # Outputs to client/dist
   ```

---

## Environment variables (recommended)

Store secrets and deployment-specific settings in environment variables rather than in source.

Example `.env` for backend (do NOT commit this file):
```
DJANGO_SECRET_KEY=replace_this_with_a_secure_key
DEBUG=False
DB_NAME=heritage_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=127.0.0.1
DB_PORT=5432
ALLOWED_HOSTS=yourdomain.com,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
MEDIA_ROOT=/path/to/project/media
```

In production you should:
- Disable DEBUG
- Set ALLOWED_HOSTS
- Use strong SECRET_KEY
- Use SSL and proper DB credentials

---

## Authentication (JWT) — quick examples

The backend uses Simple JWT. The token endpoints are in `server/core/urls.py`.

1. Obtain tokens (curl):
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password"}'
```
Response:
```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

2. Use access token in authenticated requests:
```bash
curl -H "Authorization: Bearer <access_token>" http://127.0.0.1:8000/heritage/
```

3. Refresh access token:
```bash
curl -X POST http://127.0.0.1:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"<refresh_token>"}'
```

4. Frontend notes:
- client/src/api.js contains axios interceptors that:
  - attach `Authorization: Bearer <access_token>` from localStorage
  - on 401, attempt to refresh using the `refresh_token` in localStorage, retry original request when refreshed
- The app stores tokens in localStorage using keys `access_token` and `refresh_token`. Ensure these are set after login.

---

## Important endpoints (overview)

Root routing in `server/core/urls.py` mounts the apps:

- Auth (JWT):
  - POST /api/token/ — obtain access + refresh
  - POST /api/token/refresh/ — refresh access
- Users:
  - /users/  (see users/urls.py)
- Heritage:
  - /heritage/  (see heritage/urls.py) — heritage sites, events, resources
- Forum:
  - /forum/  (see forum/urls.py) — posts, comments, votes
- Marketplace:
  - /marketplace/  (see marketplace/urls.py) — products, orders, sellers
- Admin:
  - /admin/

Note: each app typically exposes list/detail endpoints; check the specific `*/urls.py` for exact routes and any names.

---

## Database & Migrations

- The project is configured in `server/core/settings.py` to use PostgreSQL. Update DB credentials via environment variables or edit `DATABASES` for quick local work (SQLite).
- Common commands:
  ```bash
  cd server
  python manage.py makemigrations
  python manage.py migrate
  python manage.py showmigrations
  ```
- Create a superuser to access Django admin:
  ```bash
  python manage.py createsuperuser
  ```

---

## Media & Static files

- MEDIA: `MEDIA_URL = '/media/'`, `MEDIA_ROOT = <project>/media` (see settings.py).
- During development (DEBUG=True), Django serves media via `django.conf.urls.static.static`.
- For production:
  - Serve static assets (frontend build) via a web server (Nginx).
  - Serve `MEDIA_ROOT` via web server or object storage (S3).
  - Run `python manage.py collectstatic` if you add static files to Django apps.

---

## Tests & lint

- Run Django tests:
  ```bash
  cd server
  python manage.py test
  ```
- Frontend linting:
  ```bash
  cd client
  npm run lint
  ```

---

## Deployment notes (brief)

- Backend: use a production WSGI/ASGI server:
  - Gunicorn (WSGI) or Uvicorn/Gunicorn combo for ASGI
  - Example with gunicorn:
    ```bash
    pip install gunicorn
    gunicorn core.wsgi:application --bind 0.0.0.0:8000
    ```
- Database: run PostgreSQL with proper credentials; use migrations during deploy.
- Frontend: build `npm run build` and serve `client/dist` with a static host (Nginx) or CDN.
- Add HTTPS (TLS) and set secure cookies, HSTS, and other HTTP security headers via reverse proxy (Nginx).
- Move sensitive settings into environment variables (e.g., SECRET_KEY, DB password).

Optional Docker Compose snippet (example skeleton):
```yaml
version: "3.8"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: heritage_db
      POSTGRES_USER: root
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data
  web:
    build: ./server
    command: gunicorn core.wsgi:application -b 0.0.0.0:8000
    env_file: ./server/.env
    depends_on:
      - db
    volumes:
      - ./server:/app
  client:
    build: ./client
    command: npm run build
volumes:
  db-data:
```
(Adapt as needed; Dockerfiles not included in this repo.)

---

## Contributing & workflow
- Fork → Feature branch → Pull Request
- Use descriptive PR titles and include tests where applicable.
- Keep .venv, node_modules, and sensitive files out of commits:
  - Add (or ensure) `.gitignore` contains `.venv/`, `client/node_modules/`, `server/media/`, and `server/*.sqlite3`.

---

## Troubleshooting / Notes
- If you see authentication or CORS issues:
  - Confirm frontend origin (Vite dev default: http://localhost:5173) is in CORS_ALLOWED_ORIGINS in Django settings or set CORS_ALLOW_ALL_ORIGINS=True for quick dev (not for production).
- If tokens refresh fails:
  - Ensure `refresh` token exists in localStorage, and that `/api/token/refresh/` endpoint is functional.
- If you encounter missing Pillow or image handling errors:
  - pip install Pillow and restart server.

---

## Security & housekeeping (important)
- Remove committed virtualenv (.venv) from repo. Add to .gitignore and re-commit.
- Remove the hard-coded SECRET_KEY from `server/core/settings.py` and read it from environment variables.
- Never commit `server/media/` with user-uploaded files or private documents. Remove sensitive files from VCS history if they were accidentally committed.
- Review all `*.pyc` and `__pycache__` — they should be ignored by `.gitignore`.

---

## TODOs / Suggested improvements
- Add `server/requirements.txt` and `client/package-lock.json` (or yarn.lock) to lock dependencies.
- Add `README` for each app (heritage, forum, marketplace) documenting their routes and serializers.
- Add CI (tests, lint) and optional Dockerfiles for reproducible dev environment.
- Add API docs / OpenAPI schema generation (DRF has schema support).

---

## Useful commands (cheat-sheet)

Backend:
```bash
cd server
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
python manage.py test
```

Frontend:
```bash
cd client
npm install
npm run dev           # dev server
npm run build         # production build
npm run preview       # preview build
npm run lint
```

API (auth):
```bash
# get tokens
curl -X POST http://127.0.0.1:8000/api/token/ -d '{"username":"user","password":"pass"}' -H 'Content-Type: application/json'
```

---

## Where to look next
- Backend apps:
  - server/users/        — custom User model, serializers, URLs
  - server/heritage/     — HeritageSite, HeritageEvent, resources
  - server/forum/        — Post, Comment, Vote models & APIs
  - server/marketplace/  — product, order, seller models
- Frontend:
  - client/src/api.js    — axios instance and refresh flow (key place to wire env-based baseURL)
  - client/src/App.jsx   — main routes, auth gating, and pages

---

If you want, I can:
- prepare a `server/requirements.txt` with pinned dependencies,
- add a simple `docker-compose.yml` and Dockerfile for both services,
- or update `client/src/api.js` to use Vite environment variables and commit the change.

Thank you — happy to flesh out any section or create the extra files you prefer!

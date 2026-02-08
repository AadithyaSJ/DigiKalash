# DigiKalash — Setup and Run Guide

This file explains how to run the DigiKalash project (backend + frontend) on a Windows machine. It assumes you received the repository and a SQL dump of the project database.

Repository: https://github.com/AadithyaSJ/DigiKalash.git

Prerequisites
- Windows (Admin privileges for installing PostgreSQL)
- Git CLI
- Python 3.10–3.12
- Node.js 18+ (npm)
- PostgreSQL
- The SQL dump file (e.g. `dump.sql` or `heritage_db.dump`)

Overview
- Backend: `server/` (Django REST API)
- Frontend: `client/` (React + Vite)

1) Clone the repository

Open PowerShell and run:

```powershell
git clone https://github.com/AadithyaSJ/DigiKalash.git
cd DigiKalash
```

2) Backend: create a Python virtual environment and install requirements

```powershell
cd .\server
python -m venv .venv
# Activate the venv (PowerShell)
.\.venv\Scripts\Activate.ps1
# If activation blocked, run once as admin:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
pip install --upgrade pip
# If server/requirements.txt exists, run:
if (Test-Path requirements.txt) { pip install -r requirements.txt } else { pip install django djangorestframework djangorestframework-simplejwt psycopg2-binary django-cors-headers }
```

Note: If `psycopg2` installation gives trouble on Windows use `psycopg2-binary` (recommended for development).

3) Install PostgreSQL and create DB + user

- Download PostgreSQL for Windows: https://www.postgresql.org/download/windows/
- Install and note the `postgres` superuser password.

Open a new PowerShell and run `psql` (or use pgAdmin). Example using `psql` (you may need to add PostgreSQL's `bin` folder to PATH):

```powershell
# Open psql as the postgres superuser (you may be prompted for password)
psql -U postgres
# In psql shell:
CREATE DATABASE heritage_db;
CREATE USER root WITH PASSWORD 'Aadithya';
GRANT ALL PRIVILEGES ON DATABASE heritage_db TO root;
\q
```

If you want to use different DB name/user/password, update `server/core/settings.py` accordingly (DATABASES section).

4) Restore the SQL dump into PostgreSQL

Put the dump file somewhere accessible, e.g. `C:\Users\You\Downloads\dump.sql`

- For a plain SQL dump:

```powershell
psql -U root -d heritage_db -f C:\path\to\dump.sql
```

- For a custom-format dump (created by `pg_dump -Fc`):

```powershell
pg_restore -U root -d heritage_db -v C:\path\to\dump.dump
```

If `psql` or `pg_restore` is not found, run them from PostgreSQL's `bin` directory or add that folder to your PATH.

5) Verify Django settings and media

Open `server/core/settings.py` and ensure the `DATABASES` section matches your database credentials. By default this project uses:

```python
NAME: 'heritage_db'
USER: 'root'
PASSWORD: 'Aadithya'
HOST: 'localhost'
PORT: '5432'
```

Also verify `MEDIA_ROOT`:

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

If the dump references media files, place them inside `server/media/...` accordingly.

6) Run Django migrations and create superuser (if necessary)

Activate venv (if not active):

```powershell
cd .\server
.\.venv\Scripts\Activate.ps1
```

Run migrations and create a superuser:

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

If the dump already contained schema and data, `migrate` will be quick.

7) Run Django development server

```powershell
python manage.py runserver
# or to listen on all interfaces
python manage.py runserver 0.0.0.0:8000
```

Default server URL: `http://127.0.0.1:8000/`

If you use `0.0.0.0`, add `localhost` or `127.0.0.1` to `ALLOWED_HOSTS` in `server/core/settings.py` for local dev.

8) Frontend setup (Vite + React)

Open a new PowerShell window/tab and run:

```powershell
cd ..\client
npm install
npm run dev
```

Vite default dev URL: `http://localhost:5173` — this origin is already listed in `CORS_ALLOWED_ORIGINS` in the Django settings.

9) Authentication (JWT) and API calls

The backend uses Simple JWT. To call protected endpoints the frontend should obtain access & refresh tokens from the relevant API endpoints (if present) and send `Authorization: Bearer <access_token>` in requests.

10) Serve media files during development

Ensure `server/urls.py` contains media serving when `DEBUG = True`:

```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... your url patterns
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

11) Quick command summary

```powershell
# clone
git clone https://github.com/AadithyaSJ/DigiKalash.git
cd DigiKalash

# backend venv
cd .\server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt   # or fallback package install

# create DB + restore dump (psql/pg_restore examples)
psql -U postgres
# inside psql: CREATE DATABASE heritage_db; CREATE USER root WITH PASSWORD 'Aadithya'; GRANT ALL PRIVILEGES ON DATABASE heritage_db TO root; \q
psql -U root -d heritage_db -f C:\path\to\dump.sql

# run migrations + server
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# frontend
cd ..\client
npm install
npm run dev
```

12) Troubleshooting tips

- Activation blocked: run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in an elevated PowerShell window.
- `psycopg2` install fails: use `pip install psycopg2-binary` for development.
- `psql`/`pg_restore` not found: add PostgreSQL's `bin` to PATH or run from the installation folder.
- CORS errors: ensure `CORS_ALLOWED_ORIGINS` includes the frontend origin (e.g., `http://localhost:5173`).
- Media 404 errors: confirm `MEDIA_ROOT` contains expected files and Django is configured to serve media in DEBUG.

13) Recommended improvements (optional)
- Add `server/requirements.txt` (if missing). I can generate one for you.
- Create a `.env` or `env.example` and load secrets using `django-environ` rather than committing DB credentials.
- Add `docker-compose.yml` to containerize Postgres, Django, and Vite for easier setup.
- Add a `README.md` at the repo root with a short version of these steps.

If you want, I will create a short `README.md` at the project root (or replace this `SETUP.md` with `README.md`) and/or generate `server/requirements.txt`. Tell me which one to do next.
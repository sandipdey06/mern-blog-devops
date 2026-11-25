# MERN Blog

Structure: `backend/` (Express+Mongoose) · `frontend/` (React+Vite+TanStack Query, served by nginx) · `docker-compose.yml` · `.github/workflows/{ci,cd}.yml`

## Q1 – Docker (backend example; frontend is identical)
```bash
cd backend
docker build -t blog-backend .
docker network create blog-net
docker run -d --name mongo --network blog-net mongo:7
docker run -d --name blog-backend --network blog-net -p 5000:5000 -e MONGO_URI=mongodb://mongo:27017/blogdb blog-backend
docker ps
curl http://localhost:5000/api/health

cd ../frontend
docker build -t blog-frontend --build-arg VITE_API_URL=http://localhost:5000/api .
docker run -d --name blog-frontend -p 3000:8080 blog-frontend
```
Open http://localhost:3000

## Q2 – Docker Compose
```bash
docker compose up -d --build   # start all
docker compose ps              # status
docker compose logs -f backend
docker compose down            # stop (add -v to wipe DB)
```

## Q3 – Cloud
1. **MongoDB Atlas**: create free M0 cluster → Database Access: add user → Network Access: allow `0.0.0.0/0` → Connect → Drivers. Connection string:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/blogdb?retryWrites=true&w=majority`
2. **Docker Hub**: create repos `blog-backend`, `blog-frontend` (public).
   ```bash
   docker login
   docker tag blog-backend <dockerhub-user>/blog-backend:latest && docker push <dockerhub-user>/blog-backend:latest
   docker build -t <dockerhub-user>/blog-frontend:latest --build-arg VITE_API_URL=https://<BACKEND_URL>/api ./frontend
   docker push <dockerhub-user>/blog-frontend:latest
   ```
3. **Cloud Run** (gcloud CLI or console):
   ```bash
   gcloud run deploy blog-backend --image docker.io/<user>/blog-backend:latest --region asia-south1 \
     --port 5000 --allow-unauthenticated --set-env-vars MONGO_URI="<atlas-string>"
   # note backend URL, rebuild/push frontend with it (above), then:
   gcloud run deploy blog-frontend --image docker.io/<user>/blog-frontend:latest --region asia-south1 \
     --port 8080 --allow-unauthenticated
   ```
   (If Cloud Run rejects docker.io, create an Artifact Registry remote repo for Docker Hub.)

## Q4/Q5 – GitHub Actions
```bash
git init && git add . && git commit -m "init" && git branch -M main
git remote add origin https://github.com/<user>/<repo>.git && git push -u origin main
```
(Run `npm install` in `backend/` and `frontend/` once and commit the `package-lock.json` files — CI uses `npm ci`.)

Repo → Settings → Secrets and variables → Actions → add:
`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GCP_SA_KEY` (service-account JSON with roles *Cloud Run Admin* + *Service Account User*), `GCP_REGION` (e.g. asia-south1), `MONGO_URI`.
Also enable the Cloud Run Admin API on the GCP project.

CI (`ci.yml`) runs on push/PR: install, lint, backend test, frontend build. CD (`cd.yml`) runs on push to `main`: build & push images → deploy backend → deploy frontend (built with the backend URL).

## Screenshots checklist
Cloud app running · blog created + Latest Blogs list · GitHub repo · Docker Hub repos · Cloud Run services · Actions CI/CD green runs · `docker ps` / `docker compose ps`

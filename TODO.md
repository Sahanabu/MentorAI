# CORS Fix Plan

## Information Gathered
- Frontend (Vite) runs on `http://localhost:5173`
- Backend (Express) runs on `http://localhost:5000` with CORS configured to allow `http://localhost:5173` by default, but environment variable `CORS_ORIGIN` is set to `http://localhost:3000`, causing the mismatch
- AI Service (FastAPI) runs on `http://localhost:8000` with CORS allowing `http://localhost:3000` and `http://localhost:5000`
- Vite config proxies `/api` to backend and `/ai` to AI service
- CORS error occurs because backend is responding with `Access-Control-Allow-Origin: http://localhost:3000` but request comes from `http://localhost:5173`

## Plan
- Update backend CORS configuration to allow both `http://localhost:5173` and `http://localhost:3000` (for flexibility)
- Update AI service CORS to allow `http://localhost:5173`
- Update Socket.IO CORS in server.js similarly

## Dependent Files to Edit
- `backend/src/app.js`: Update CORS origin to array including both ports
- `backend/src/server.js`: Update Socket.IO CORS origin to array
- `ai-service/src/main.py`: Update FastAPI CORS origins to include `http://localhost:5173`

## Changes Made
- [x] `backend/src/app.js`: Updated CORS origin to support array of origins
- [x] `backend/src/server.js`: Updated Socket.IO CORS origin to support array of origins
- [x] `ai-service/src/main.py`: Added `http://localhost:5173` to allowed origins

## Followup Steps
- Restart backend and AI service to apply changes
- Test login functionality from frontend
- Verify no more CORS errors in browser console

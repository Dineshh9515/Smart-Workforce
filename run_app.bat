@echo off
echo Starting Smart Workforce & Asset Availability Management System...

start "MongoDB" mongod

timeout /t 5

echo Starting Backend...
cd backend
start "Backend Server" npm run dev

timeout /t 5

echo Starting Frontend...
cd ../frontend
start "Frontend Client" npm run dev

echo All services started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause

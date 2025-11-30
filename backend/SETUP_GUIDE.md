# Backend Setup Guide (Windows)

## Quick Start

```powershell
cd backend
npm install
npm run dev
```

If `npm install` fails, follow the solutions below.

## Common Issues & Solutions

### Issue 1: npm ERR! gyp ERR! (bcrypt compilation error)

**Cause**: bcrypt requires Python and C++ build tools on Windows.

**Solution A: Install Build Tools (Recommended)**

1. Install Node.js Build Tools:
   - Open PowerShell **as Administrator**
   - Run: `npm install --global windows-build-tools`
   - Wait ~10 minutes for installation
   - Then: `npm install` in the backend folder

2. If above fails, install manually:
   - Download Visual Studio Build Tools: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Run installer, select "Desktop development with C++"
   - Complete installation
   - Then: `npm install`

**Solution B: Skip bcrypt (use alternative)**

If bcrypt keeps failing:
1. Remove bcrypt from package.json dependencies
2. Add: `"bcryptjs": "^2.4.3"` instead (pure JavaScript, no native compilation)
3. Update authController.ts: replace `import bcrypt from 'bcrypt'` with `import bcrypt from 'bcryptjs'`
4. Run: `npm install`

### Issue 2: npm ERR! network timeout

**Cause**: Network/registry connectivity issue.

**Solution:**
```powershell
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install
```

### Issue 3: Permission denied / EPERM errors

**Cause**: File lock or antivirus blocking.

**Solution:**
```powershell
# Clear npm cache and node_modules
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force

# Reinstall
npm install
```

### Issue 4: Module 'express' not found errors in IDE

**Cause**: Dependencies installed but VS Code not reloaded.

**Solution:**
1. Close and reopen VS Code
2. Or press `Ctrl+Shift+P` → "Reload Window"

## Environment Setup

### Option A: Local MongoDB
```
# Install MongoDB Community: https://www.mongodb.com/try/download/community
# Start MongoDB: mongod

# Set in .env:
MONGO_URI=mongodb://localhost:27017/teamtime
JWT_SECRET=your-secret-key
```

### Option B: MongoDB Atlas (Recommended)

Already in your `.env.example`. Just fill in:

```
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/teamtime?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
```

## Running the Server

```powershell
# Development (auto-reload on file changes)
npm run dev

# Production build
npm run build
npm start

# Lint TypeScript
npm run lint
```

Server runs on `http://localhost:4000` (or `$PORT` from .env).

## Testing Endpoints

### Register a user:
```powershell
$header = @{'Content-Type'='application/json'}
$body = @{username='testuser'; password='pass123'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:4000/api/auth/register' -Method POST -Headers $header -Body $body
```

### Login:
```powershell
$header = @{'Content-Type'='application/json'}
$body = @{username='testuser'; password='pass123'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri 'http://localhost:4000/api/auth/login' -Method POST -Headers $header -Body $body
$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

### Use protected endpoints:
```powershell
$header = @{
  'Content-Type'='application/json'
  'Authorization'="Bearer $token"
}
Invoke-WebRequest -Uri 'http://localhost:4000/api/auth/me' -Method GET -Headers $header
```

Or use Postman/Insomnia and copy the token from login response into the Authorization header.

## Troubleshooting Checklist

- [ ] Node.js and npm installed? → Run `node --version` and `npm --version`
- [ ] Inside `backend` folder? → Check with `pwd` (PowerShell: `Get-Location`)
- [ ] `.env` file created from `.env.example`? → Check if `.env` exists
- [ ] `MONGO_URI` set correctly? → Can you connect to MongoDB manually?
- [ ] Port 4000 available? → Run `netstat -ano | findstr :4000` to check
- [ ] npm dependencies installed? → Check `node_modules` folder exists
- [ ] VS Code reloaded? → Close and reopen or Ctrl+Shift+P → "Reload Window"

## Quick Commands Reference

```powershell
# Install dependencies
npm install

# Start dev server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
```

## Next Steps

1. Complete `npm install` successfully
2. Start dev server: `npm run dev`
3. Test endpoints with curl, PowerShell, or Postman
4. Connect frontend to backend (update API_BASE_URL in frontend)

## Support

If stuck, check:
- Backend logs in terminal running `npm run dev`
- MongoDB connection: test with MongoDB Compass or `mongosh`
- Network: verify MONGO_URI is correct
- Firewall: ensure port 4000 is allowed

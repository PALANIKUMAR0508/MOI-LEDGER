# 🔧 MOI Ledger - Registration Issue Debug Guide

## Problem
Vercel-la host pannuna appuram new account create panna DB-la store aagala.

## Changes Made

### 1. **CORS Configuration Updated** (`server/server.js`)
- Added flexible CORS to allow all `.vercel.app` domains
- Added logging for blocked origins
- Now allows: Vercel production, localhost development

### 2. **Better Error Logging** (`server/routes/auth.js`)
- Added console logs for registration attempts
- Shows which step failed (missing fields, user exists, etc.)
- Logs successful registrations with user ID

### 3. **Test Endpoint Added** (`server/server.js`)
- New endpoint: `GET /api/test`
- Helps verify API is reachable from frontend

## Debugging Steps

### Step 1: Check if Backend is Running
Open browser and go to:
```
https://moi-ledger.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2026-04-19T..."
}
```

If `mongodb: "disconnected"`, check Render environment variables.

---

### Step 2: Check API Endpoint
```
https://moi-ledger.onrender.com/api/test
```

**Expected Response:**
```json
{
  "message": "API is reachable",
  "mongodb": "connected",
  "timestamp": "..."
}
```

---

### Step 3: Use Test HTML File
1. Open `test-api.html` in browser
2. Click "Test Connection" - Should show green result
3. Click "Test MongoDB" - Should show "connected"
4. Try "Register Test User" - Should create user successfully
5. Try "Login Test User" - Should login successfully

---

### Step 4: Check Render Logs
1. Go to Render Dashboard: https://dashboard.render.com
2. Click on your `moi-ledger` service
3. Click "Logs" tab
4. Try to register from Vercel
5. Check logs for:
   - `Registration attempt: { username: '...', email: '...' }`
   - `User registered successfully: <user_id>`
   - OR error messages

---

### Step 5: Check Render Environment Variables
Go to Render Dashboard → Your Service → Environment

**Required Variables:**
```
MONGO_URI=mongodb+srv://palanikumar_0508_db:mongodb_26@moi-ledger.n8a50wv.mongodb.net/moi-ledger?retryWrites=true&w=majority&appName=moi-ledger
JWT_SECRET=moi_grand_ledger_secret_2024_aurelian
PORT=5000
```

---

### Step 6: Check MongoDB Atlas
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click on your cluster
3. Click "Network Access"
4. Make sure `0.0.0.0/0` is allowed (or add Render's IP)
5. Click "Database Access"
6. Verify user `palanikumar_0508_db` exists with password `mongodb_26`

---

### Step 7: Test from Vercel Frontend
1. Open browser console (F12)
2. Go to: https://moi-ledger-esg3.vercel.app/register
3. Try to register
4. Check console for errors:
   - Network errors (CORS, connection refused)
   - 400 errors (validation, user exists)
   - 500 errors (server error)

---

## Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS`

**Solution:**
- Check Render logs for: `CORS blocked origin: ...`
- If you see a different Vercel URL, add it to `corsOptions` in `server/server.js`

---

### Issue 2: MongoDB Connection Failed
**Error:** `mongodb: "disconnected"` in health check

**Solution:**
1. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
2. Verify MONGO_URI in Render environment variables
3. Check MongoDB Atlas user credentials

---

### Issue 3: User Already Exists
**Error:** `User already exists`

**Solution:**
- This means registration IS working, but user already registered
- Try different email/username
- Or check MongoDB Atlas → Browse Collections → users

---

### Issue 4: API Not Reachable
**Error:** `Failed to fetch` or `net::ERR_CONNECTION_REFUSED`

**Solution:**
1. Check if Render service is running (not sleeping)
2. Render free tier sleeps after 15 min inactivity
3. Visit `https://moi-ledger.onrender.com/health` to wake it up
4. Wait 30-60 seconds for cold start

---

## Quick Test Commands

### Test from Terminal (curl)
```bash
# Test connection
curl https://moi-ledger.onrender.com/health

# Test registration
curl -X POST https://moi-ledger.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser456","email":"test456@example.com","password":"testpass123"}'
```

---

## Next Steps

1. **First:** Check Render logs while trying to register
2. **Second:** Use `test-api.html` to isolate the issue
3. **Third:** Check MongoDB Atlas network access
4. **Fourth:** Verify environment variables in Render

---

## Contact Points

- **Frontend URL:** https://moi-ledger-esg3.vercel.app
- **Backend URL:** https://moi-ledger.onrender.com
- **Health Check:** https://moi-ledger.onrender.com/health
- **API Test:** https://moi-ledger.onrender.com/api/test

---

## Files Modified

1. `server/server.js` - CORS + test endpoint
2. `server/routes/auth.js` - Better logging
3. `test-api.html` - Testing tool (NEW)
4. `DEBUG-STEPS.md` - This guide (NEW)

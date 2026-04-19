# 🔐 Fix Login Issue - "Invalid Credentials"

## Problem
- Signup works fine ✓
- Logout works fine ✓
- Login fails with "Invalid credentials" ✗

## Changes Made

### 1. **Added Detailed Login Logging** (`server/routes/auth.js`)
Now logs:
- Login attempt with email
- Whether user was found in database
- Password hash length
- Password comparison result
- Success or failure reason

### 2. **Added Debug Endpoint** (`server/server.js`)
New endpoint to check if user exists and password is stored:
```
GET /api/debug/user/:email
```

Example: `https://moi-ledger.onrender.com/api/debug/user/test@example.com`

### 3. **Created Test Tool** (`test-login.html`)
- Register a new user
- Immediately try to login with same credentials
- See detailed results

---

## How to Debug

### **Step 1: Use Test Tool**
1. Open `test-login.html` in browser
2. Click "Register" (it has random credentials pre-filled)
3. Immediately click "Login" (same credentials auto-filled)
4. Check if login works

**If login works in test tool but not in your app:**
- Problem is in frontend (React app)
- Check browser console for errors

**If login fails in test tool too:**
- Problem is in backend
- Continue to Step 2

---

### **Step 2: Check Render Logs**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your service
3. Click "Logs" tab
4. Try to login from Vercel
5. Look for these logs:

**Successful Login:**
```
Login attempt: { email: 'user@example.com' }
User found: { id: '...', email: '...', hasPassword: true }
Stored password hash length: 60
Input password length: 10
Password match result: true
Login successful for user: ...
```

**Failed Login:**
```
Login attempt: { email: 'user@example.com' }
User found: { id: '...', email: '...', hasPassword: true }
Stored password hash length: 60
Input password length: 10
Password match result: false
Login failed: Password mismatch for user: ...
```

---

### **Step 3: Check User in Database**
Use the debug endpoint to verify user exists:

```
https://moi-ledger.onrender.com/api/debug/user/YOUR_EMAIL_HERE
```

**Expected Response:**
```json
{
  "found": true,
  "userId": "...",
  "username": "...",
  "email": "...",
  "hasPassword": true,
  "passwordLength": 60,
  "passwordStartsWith": "$2b$12$",
  "createdAt": "..."
}
```

**Important Checks:**
- `found: true` - User exists ✓
- `hasPassword: true` - Password field exists ✓
- `passwordLength: 60` - bcrypt hash is correct length ✓
- `passwordStartsWith: "$2b$12$"` or `"$2a$12$"` - Valid bcrypt hash ✓

**If any of these are wrong, there's a database issue!**

---

## Possible Causes & Solutions

### **Cause 1: Password Trimming Issue**
Frontend might be trimming password on register but not on login (or vice versa).

**Solution:**
Check `Register.jsx` and `SignIn.jsx` - make sure both handle password the same way.

---

### **Cause 2: Email Case Sensitivity**
Email might be stored as lowercase but login is sending mixed case.

**Solution:**
Already handled in User model with `lowercase: true`, but check frontend.

---

### **Cause 3: Extra Spaces**
Password might have extra spaces at beginning or end.

**Solution:**
Add `.trim()` to password in both register and login:

```javascript
// In Register.jsx and SignIn.jsx
const password = form.password.trim();
```

---

### **Cause 4: Different bcrypt Versions**
If you have multiple bcrypt packages installed.

**Solution:**
Check `server/package.json` - should only have `bcryptjs`:
```json
"dependencies": {
  "bcryptjs": "^2.4.3"
}
```

---

### **Cause 5: Password Not Saved**
User registered but password wasn't saved to database.

**Solution:**
Use debug endpoint to check. If `hasPassword: false`, there's a database save issue.

---

## Quick Test Commands

### Test with curl:
```bash
# Register
curl -X POST https://moi-ledger.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"curltest","email":"curltest@example.com","password":"TestPass123"}'

# Login (should work immediately)
curl -X POST https://moi-ledger.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"curltest@example.com","password":"TestPass123"}'

# Check user in database
curl https://moi-ledger.onrender.com/api/debug/user/curltest@example.com
```

---

## Frontend Check

### Check Register.jsx
Look for password handling:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  // Make sure password is not modified here
  await register(form.username, form.email, form.password);
};
```

### Check SignIn.jsx
Look for password handling:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  // Make sure password is not modified here
  await login(form.email, form.password);
};
```

### Check AuthContext.jsx
Look at login and register functions:
```javascript
const login = async (email, password) => {
  // Should send password as-is, no modification
  const res = await axios.post(`${API}/auth/login`, { email, password });
  // ...
};

const register = async (username, email, password) => {
  // Should send password as-is, no modification
  const res = await axios.post(`${API}/auth/register`, { username, email, password });
  // ...
};
```

---

## Next Steps

1. **Deploy these changes:**
   ```bash
   git add .
   git commit -m "Add detailed login debugging"
   git push origin main
   ```

2. **Wait for Render to deploy** (2-3 minutes)

3. **Open `test-login.html`** and test

4. **Check Render logs** while testing

5. **Use debug endpoint** to verify user data

6. **Report back** with:
   - What you see in Render logs
   - What debug endpoint shows
   - Whether test-login.html works

---

## Important Notes

- The debug endpoint (`/api/debug/user/:email`) should be **removed in production**
- It doesn't show the actual password (only hash info)
- But it's still sensitive information
- Remove it after debugging

---

## Files Modified

1. `server/routes/auth.js` - Added detailed logging
2. `server/server.js` - Added debug endpoint
3. `test-login.html` - Testing tool (NEW)
4. `FIX-LOGIN-ISSUE.md` - This guide (NEW)

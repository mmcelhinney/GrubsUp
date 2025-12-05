# Debugging Phone Connection Issues

## Current Setup

- **Frontend:** `http://192.168.0.17:3000` (accessible from phone)
- **Backend:** `http://localhost:5000` (only on your computer)
- **Proxy:** Vite proxy forwards `/api` requests from port 3000 to port 5000

## How It Should Work

1. Phone accesses: `http://192.168.0.17:3000`
2. Frontend makes API call to: `/api/auth/login` (relative URL)
3. Vite proxy intercepts `/api` requests
4. Proxy forwards to: `http://localhost:5000/api/auth/login`
5. Backend processes request

## Debugging Steps

### 1. Check Frontend Terminal

When you try to login from your phone, check the **frontend terminal** (where `npm run dev` is running). You should see:

```
🔄 Proxying: POST /api/auth/login -> http://localhost:5000/api/auth/login
✅ Proxy response: 200 for /api/auth/login
```

If you see proxy errors, that's the issue.

### 2. Check Backend Terminal

Check the **backend terminal**. You should see:

```
[timestamp] POST /api/auth/login
  IP: 192.168.0.17 (or similar)
📋 ACTIVITY LOG [LOGIN_ATTEMPT]
```

If you don't see this, the proxy isn't forwarding requests.

### 3. Test from Phone Browser

On your phone, open the browser console (if possible) or try accessing directly:

- `http://192.168.0.17:3000/api/health`

This should work if the proxy is working. If it doesn't, the proxy isn't configured correctly.

### 4. Check Browser Console on Phone

If you can access browser dev tools on your phone (or use remote debugging), check for:
- Network errors
- CORS errors
- The actual request URL being used

## Common Issues

### Issue 1: Proxy Not Working

**Symptoms:**
- Frontend terminal shows no proxy logs
- Requests fail with network error

**Solution:**
- Restart the frontend dev server
- Check that `vite.config.js` has the proxy configured
- Make sure you're accessing via `http://192.168.0.17:3000`, not `localhost:3000`

### Issue 2: Backend Not Running

**Symptoms:**
- Frontend terminal shows proxy errors
- "ECONNREFUSED" errors

**Solution:**
- Make sure backend is running: `cd backend && npm run dev`
- Check backend terminal for errors

### Issue 3: Firewall Blocking

**Symptoms:**
- Works on workstation, not on phone
- Timeout errors

**Solution:**
- Make sure port 3000 is open in Windows Firewall
- Check that both devices are on same network

## Quick Test

1. **On your phone browser**, go to:
   ```
   http://192.168.0.17:3000/api/health
   ```

2. **You should see:**
   ```json
   {"status":"ok","database":"connected",...}
   ```

3. **If you see this**, the proxy is working! The login should work too.

4. **If you get an error**, check:
   - Frontend terminal for proxy logs
   - Backend terminal for request logs
   - Backend is actually running

## Next Steps

After testing, check:
1. What do you see in the **frontend terminal** when you try to login from phone?
2. What do you see in the **backend terminal**?
3. Can you access `http://192.168.0.17:3000/api/health` from your phone?


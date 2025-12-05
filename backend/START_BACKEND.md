# Starting the Backend Server

## Quick Start

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Make sure you have a `.env` file:**
   ```bash
   # Check if .env exists
   ls .env
   
   # If not, copy from example
   cp .env.example .env
   # Then edit .env and add your database credentials
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

## What You Should See

When the backend starts successfully, you should see:

```
🔄 Initializing database...
✅ Prisma Client found, proceeding...
✅ Database connected successfully
🚀 Server running on http://localhost:5000
🌐 Network access: http://192.168.x.x:5000
```

## Common Issues

### 1. "Cannot find module" errors

**Solution:** Install dependencies
```bash
npm install
```

### 2. Database connection errors

**Check:**
- Is MySQL running?
- Is `DATABASE_URL` correct in `.env`?
- Does the database `dinnersready` exist?

**Fix:**
```bash
# Create database
mysql -u root -p
CREATE DATABASE dinnersready;
exit;

# Then restart backend
npm run dev
```

### 3. Port 5000 already in use

**Solution:** Change port in `.env`
```env
PORT=5001
```

Or kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### 4. Prisma Client not generated

**Solution:**
```bash
npx prisma generate
npm run dev
```

### 5. Module import errors

**Check:**
- Are you in the `backend` directory?
- Did you run `npm install`?
- Is Node.js version 18+?

## Testing the Backend

Once running, test it:

1. **Health check:**
   - Open: `http://localhost:5000/api/health`
   - Should see: `{"status":"ok","database":"connected",...}`

2. **Check console:**
   - You should see request logs when you make API calls

## If Server Won't Start

1. **Check for errors in the terminal** - look for red error messages
2. **Check `.env` file exists and has correct values**
3. **Try starting without watch mode:**
   ```bash
   npm start
   ```
4. **Check Node.js version:**
   ```bash
   node --version
   # Should be 18 or higher
   ```


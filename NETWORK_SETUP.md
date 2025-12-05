# Network Access Setup

## Quick Start

The app is now configured to be accessible from any device on your local network!

## Steps to Access from Your Phone

### 1. Start the Servers

```bash
# From project root
npm run dev
```

Or separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 2. Check the Console Output

When you start the backend, you'll see output like:

```
🚀 Server running on http://localhost:5000
🌐 Network access: http://192.168.1.100:5000

📱 To access from your phone:
   1. Make sure your phone is on the same WiFi network
   2. Frontend: http://192.168.1.100:3000
   3. Backend API: http://192.168.1.100:5000/api/health
```

### 3. Connect Your Phone

1. **Make sure your phone is on the same WiFi network** as your computer
2. Open your phone's browser
3. Navigate to: `http://192.168.1.100:3000` (use the IP shown in your console)

## Finding Your IP Address Manually

If you need to find your IP address:

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

**Mac/Linux:**
```bash
ifconfig
# Or
ip addr
# Look for your network interface (usually starts with 192.168.x.x or 10.x.x.x)
```

## Troubleshooting

### Can't Connect from Phone

1. **Check Firewall**: Make sure your firewall allows connections on ports 3000 and 5000
   - Windows: Allow Node.js through Windows Firewall
   - Mac: System Preferences > Security & Privacy > Firewall

2. **Check Network**: Ensure both devices are on the same WiFi network

3. **Check IP Address**: Verify the IP address shown in the console matches your computer's IP

4. **Try Direct IP**: Instead of using the IP from console, try manually finding your IP (see above)

### CORS Errors

The backend is configured to allow all origins in development. If you see CORS errors:
- Make sure you're accessing via the IP address, not localhost
- Check that the frontend is also accessible via IP

### Images Not Loading

Images should automatically use the correct URL. If they don't load:
- Check that the backend is accessible from your phone
- Verify the image path is correct

## Production Notes

For production deployment:
- Set `HOST` environment variable if needed
- Configure proper CORS origins
- Use environment variables for API URLs
- Consider using a reverse proxy (nginx, etc.)


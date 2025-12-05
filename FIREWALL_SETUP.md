# Firewall Setup for Network Access

## Windows Firewall - Allow Port 5000

### Method 1: Using Windows Defender Firewall GUI

1. **Open Windows Defender Firewall:**
   - Press `Win + R`
   - Type: `wf.msc`
   - Press Enter

2. **Create Inbound Rule:**
   - Click "Inbound Rules" in the left panel
   - Click "New Rule..." in the right panel
   - Select "Port" → Next
   - Select "TCP"
   - Select "Specific local ports" and enter: `5000`
   - Click Next
   - Select "Allow the connection" → Next
   - Check all profiles (Domain, Private, Public) → Next
   - Name it: "DinnersReady Backend API"
   - Click Finish

3. **Create Outbound Rule (usually not needed, but just in case):**
   - Repeat the same steps for "Outbound Rules"
   - Port 5000, TCP, Allow

### Method 2: Using Command Prompt (Admin)

```bash
# Allow inbound connections on port 5000
netsh advfirewall firewall add rule name="DinnersReady Backend API" dir=in action=allow protocol=TCP localport=5000

# Allow outbound (usually not needed)
netsh advfirewall firewall add rule name="DinnersReady Backend API Out" dir=out action=allow protocol=TCP localport=5000
```

### Method 3: Allow Node.js Through Firewall

If you prefer to allow Node.js specifically:

1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change settings" → "Allow another app"
4. Browse to: `C:\Program Files\nodejs\node.exe` (or wherever Node.js is installed)
5. Check both "Private" and "Public"
6. Click OK

## Verify It's Working

After opening the port, test from your phone:
- Open browser on phone
- Go to: `http://192.168.0.17:5000/api/health`
- Should see: `{"status":"ok","database":"connected",...}`

## Troubleshooting

If it still doesn't work:
1. Check if another firewall (antivirus, corporate firewall) is blocking it
2. Verify the IP address is correct (check with `ipconfig`)
3. Make sure both devices are on the same network
4. Try temporarily disabling firewall to test (then re-enable and configure properly)


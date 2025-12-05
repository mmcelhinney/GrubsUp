// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Log request
  console.log(`\n[${timestamp}] ${req.method} ${req.path}`);
  console.log(`  IP: ${ip}`);
  console.log(`  User-Agent: ${req.get('user-agent') || 'unknown'}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    // Don't log passwords
    const safeBody = { ...req.body };
    if (safeBody.password) {
      safeBody.password = '***';
    }
    console.log(`  Body:`, safeBody);
  }
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`  Status: ${res.statusCode} (${duration}ms)`);
    if (res.statusCode >= 400) {
      console.log(`  Response:`, data?.toString().substring(0, 200));
    }
    return originalSend.call(this, data);
  };
  
  next();
};

// Activity logger - logs important events
export const logActivity = async (type, details, userId = null, ip = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type,
    userId,
    ip,
    details
  };
  
  // Console log
  console.log(`\n📋 ACTIVITY LOG [${type}]`);
  console.log(`  Time: ${timestamp}`);
  if (userId) console.log(`  User: ${userId}`);
  if (ip) console.log(`  IP: ${ip}`);
  console.log(`  Details:`, details);
  
  // In the future, you could save this to a database
  // For now, we'll just log to console and optionally to a file
  
  return logEntry;
};


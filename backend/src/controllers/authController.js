import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import prisma from '../utils/db.js';
import { generateTokens } from '../utils/jwt.js';
import { logActivity } from '../middleware/logger.js';

// Helper to get client IP
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
         'unknown';
};

export const register = async (req, res, next) => {
  const clientIP = getClientIP(req);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await logActivity('REGISTER_VALIDATION_ERROR', {
        errors: errors.array()
      }, null, clientIP);
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    
    await logActivity('REGISTER_ATTEMPT', {
      username,
      email
    }, null, clientIP);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: 'user'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    await logActivity('REGISTER_SUCCESS', {
      username: user.username,
      email: user.email
    }, user.id, clientIP);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    await logActivity('REGISTER_ERROR', {
      error: error.message,
      username: req.body.username
    }, null, clientIP);
    next(error);
  }
};

export const login = async (req, res, next) => {
  const clientIP = getClientIP(req);
  const { username, password } = req.body || {};
  
  try {
    // Log login attempt
    await logActivity('LOGIN_ATTEMPT', {
      username: username || 'missing',
      hasPassword: !!password,
      userAgent: req.get('user-agent')
    }, null, clientIP);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await logActivity('LOGIN_VALIDATION_ERROR', {
        errors: errors.array(),
        username: username || 'missing'
      }, null, clientIP);
      return res.status(400).json({ errors: errors.array() });
    }

    if (!username || !password) {
      await logActivity('LOGIN_MISSING_CREDENTIALS', {
        hasUsername: !!username,
        hasPassword: !!password
      }, null, clientIP);
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { username }
      });
    } catch (dbError) {
      console.error('❌ DATABASE ERROR during user lookup:', dbError);
      await logActivity('LOGIN_DB_ERROR', {
        error: dbError.message,
        username
      }, null, clientIP);
      return res.status(500).json({ error: 'Database connection error' });
    }

    if (!user) {
      await logActivity('LOGIN_FAILED', {
        reason: 'USER_NOT_FOUND',
        username
      }, null, clientIP);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, user.passwordHash);
    } catch (bcryptError) {
      console.error('❌ BCRYPT ERROR:', bcryptError);
      await logActivity('LOGIN_BCRYPT_ERROR', {
        error: bcryptError.message,
        username
      }, user.id, clientIP);
      return res.status(500).json({ error: 'Password verification error' });
    }

    if (!isValidPassword) {
      await logActivity('LOGIN_FAILED', {
        reason: 'INVALID_PASSWORD',
        username
      }, user.id, clientIP);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    await logActivity('LOGIN_SUCCESS', {
      username: user.username,
      role: user.role
    }, user.id, clientIP);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    console.error('❌ Error stack:', error.stack);
    await logActivity('LOGIN_ERROR', {
      error: error.message,
      stack: error.stack?.substring(0, 500),
      username: username || 'unknown'
    }, null, clientIP);
    next(error);
  }
};

export const logout = async (req, res) => {
  // With JWT, logout is handled client-side by removing tokens
  // In a production app, you might want to maintain a token blacklist
  res.json({ message: 'Logout successful' });
};

export const getMe = async (req, res) => {
  res.json({
    user: req.user
  });
};

export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];


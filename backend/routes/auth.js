import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Enforce single admin rule
        const requestedRole = role || 'USER';
        if (requestedRole === 'ADMIN') {
            const existingAdmin = await User.findOne({ role: 'ADMIN' });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    message: 'An admin already exists. Only one admin is allowed in the system.'
                });
            }
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Determine initial access status:
        // ADMIN always starts active. Regular USERs start as 'pending' until admin grants access.
        const initialStatus = requestedRole === 'ADMIN' ? 'active' : 'pending';

        // Create user
        const user = await User.create({
            email,
            password,
            role: requestedRole,
            accessStatus: initialStatus
        });

        res.status(201).json({
            success: true,
            message: requestedRole === 'ADMIN'
                ? 'Admin account created successfully. You can login now.'
                : 'Registration successful! Please wait for the admin to grant you access before logging in.',
            data: {
                id: user._id,
                email: user.email,
                role: user.role,
                accessStatus: user.accessStatus
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check access status - both 'pending' and 'revoked' prevent login
        if (user.accessStatus === 'pending') {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending approval. Please wait for the admin to grant you access.'
            });
        }
        if (user.accessStatus === 'revoked') {
            return res.status(403).json({
                success: false,
                message: 'Your access has been revoked. Please contact the administrator.'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    accessStatus: user.accessStatus
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        data: {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            accessStatus: req.user.accessStatus
        }
    });
});

export default router;

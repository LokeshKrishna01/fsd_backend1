import express from 'express';
import User from '../models/User.js';
import AccessLog from '../models/AccessLog.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(protect, requireAdmin);

// @route   GET /api/admin/users
// @desc    Get all users with their access status
// @access  Private/Admin
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users',
            error: error.message
        });
    }
});

// @route   POST /api/admin/grant-access
// @desc    Grant access to a user
// @access  Private/Admin
router.post('/grant-access', async (req, res) => {
    try {
        const { userId, reason } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user access status
        user.accessStatus = 'active';
        await user.save();

        // Create access log
        await AccessLog.create({
            userId: user._id,
            userEmail: user.email,
            action: 'granted',
            performedBy: req.user._id,
            performedByEmail: req.user.email,
            reason: reason || 'Access granted by admin'
        });

        res.json({
            success: true,
            message: 'Access granted successfully',
            data: {
                userId: user._id,
                email: user.email,
                accessStatus: user.accessStatus
            }
        });
    } catch (error) {
        console.error('Grant access error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error granting access',
            error: error.message
        });
    }
});

// @route   POST /api/admin/revoke-access
// @desc    Revoke access from a user
// @access  Private/Admin
router.post('/revoke-access', async (req, res) => {
    try {
        const { userId, reason } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from revoking their own access
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot revoke your own access'
            });
        }

        // Update user access status
        user.accessStatus = 'revoked';
        await user.save();

        // Create access log
        await AccessLog.create({
            userId: user._id,
            userEmail: user.email,
            action: 'revoked',
            performedBy: req.user._id,
            performedByEmail: req.user.email,
            reason: reason || 'Access revoked by admin'
        });

        res.json({
            success: true,
            message: 'Access revoked successfully. User will be logged out on next request.',
            data: {
                userId: user._id,
                email: user.email,
                accessStatus: user.accessStatus
            }
        });
    } catch (error) {
        console.error('Revoke access error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error revoking access',
            error: error.message
        });
    }
});

// @route   GET /api/admin/access-history
// @desc    Get access grant/revoke history
// @access  Private/Admin
router.get('/access-history', async (req, res) => {
    try {
        const logs = await AccessLog.find()
            .populate('userId', 'email role')
            .populate('performedBy', 'email role')
            .sort({ timestamp: -1 })
            .limit(100);

        res.json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        console.error('Get access history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching access history',
            error: error.message
        });
    }
});

export default router;

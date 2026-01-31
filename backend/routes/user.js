import express from 'express';
import { protect } from '../middleware/auth.js';
import { requireUser } from '../middleware/roleCheck.js';

const router = express.Router();

// @route   GET /api/user/status
// @desc    Get current user's access status
// @access  Private/User
router.get('/status', protect, requireUser, async (req, res) => {
    res.json({
        success: true,
        data: {
            email: req.user.email,
            role: req.user.role,
            accessStatus: req.user.accessStatus,
            message: req.user.accessStatus === 'active'
                ? 'You have active access to the system'
                : 'Your access has been revoked'
        }
    });
});

export default router;

import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['granted', 'revoked'],
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    performedByEmail: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

// Prevent modifications to logs (immutable audit trail)
accessLogSchema.pre('save', function (next) {
    if (!this.isNew) {
        throw new Error('Access logs cannot be modified');
    }
    next();
});

const AccessLog = mongoose.model('AccessLog', accessLogSchema);

export default AccessLog;

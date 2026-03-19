// Script to find existing admin and reset their password to "Admin@1234"
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const users = db.collection('users');

    // Find the admin
    const admin = await users.findOne({ role: 'ADMIN' });

    if (!admin) {
        console.log('❌ No admin found in database');
        process.exit(0);
    }

    console.log(`\n📧 EXISTING ADMIN EMAIL: ${admin.email}`);
    console.log(`🔑 Access Status: ${admin.accessStatus}`);

    // Reset password to Admin@1234
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash('Admin@1234', salt);

    await users.updateOne(
        { _id: admin._id },
        { $set: { password: newHash, accessStatus: 'active' } }
    );

    console.log('\n✅ Password reset to: Admin@1234');
    console.log(`\n👉 Login Credentials:`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: Admin@1234`);
    console.log('\n');

    await mongoose.disconnect();
    process.exit(0);
};

run().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String, enum: ['seeker', 'recruiter', 'admin'], default: 'seeker' },
    profile: {
        skills: [String],
        experience: [{
            title: String,
            company: String,
            duration: String,
            description: String,
        }],
        education: [{
            school: String,
            degree: String,
            year: String,
        }],
        resumeUrl: String,
    },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

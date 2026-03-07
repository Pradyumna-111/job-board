import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['full-time', 'part-time', 'internship', 'remote'], required: true },
    salaryRange: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'USD' }
    },
    skillsRequired: [String],
    qualifications: [String],
    deadline: { type: Date },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    views: { type: Number, default: 0 },
    postedBy: { type: String, required: true }, // Clerk ID
    createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;

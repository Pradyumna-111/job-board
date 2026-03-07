import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk ID
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, // External job (RapidAPI) might not have a ref
    jobData: { type: Object }, // To store external job details
    isExternal: { type: Boolean, default: false },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    coverLetter: { type: String },
    resumeUrl: { type: String },
    status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'interviewing'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export default Application;

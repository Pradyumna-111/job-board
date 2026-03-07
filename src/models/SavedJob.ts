import mongoose from 'mongoose';

const SavedJobSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk ID
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    createdAt: { type: Date, default: Date.now },
});

const SavedJob = mongoose.models.SavedJob || mongoose.model('SavedJob', SavedJobSchema);

export default SavedJob;

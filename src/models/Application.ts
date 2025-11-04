import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    job: { type: Object, required: true },
    status: { type: String, default: 'Applied' },
    appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export default Application;

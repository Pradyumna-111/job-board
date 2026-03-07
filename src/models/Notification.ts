import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk ID
    message: { type: String, required: true },
    type: { type: String, enum: ['application_update', 'job_alert', 'system'], required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification;

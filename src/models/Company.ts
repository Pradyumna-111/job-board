import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    logoUrl: { type: String },
    recruiterId: { type: String, required: true }, // Clerk ID of the recruiter
    location: { type: String },
    industry: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

export default Company;

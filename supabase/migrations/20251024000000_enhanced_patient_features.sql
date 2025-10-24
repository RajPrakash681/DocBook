-- Enhanced Patient Profile Fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS height DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT[],
ADD COLUMN IF NOT EXISTS chronic_conditions TEXT[],
ADD COLUMN IF NOT EXISTS current_medications TEXT[];

-- Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    record_type TEXT CHECK (record_type IN ('prescription', 'lab_report', 'imaging', 'discharge_summary')),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    doctor_name TEXT,
    hospital_name TEXT,
    record_date DATE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags TEXT[]
);

-- Doctor Time Slots Table
CREATE TABLE IF NOT EXISTS doctor_time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    max_bookings INTEGER DEFAULT 1,
    current_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(doctor_id, date, start_time)
);

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name TEXT NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    features JSONB NOT NULL,
    max_appointments INTEGER NOT NULL,
    discount_percentage DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
    appointments_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient Journey Tracking Table
CREATE TABLE IF NOT EXISTS patient_journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB,
    page_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update Appointments Table
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS slot_status TEXT CHECK (slot_status IN ('available', 'booked', 'blocked')) DEFAULT 'booked',
ADD COLUMN IF NOT EXISTS booking_notes TEXT,
ADD COLUMN IF NOT EXISTS appointment_reason TEXT;

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_health_records_patient ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctor_slots_date ON doctor_time_slots(doctor_id, date);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_patient_journey_patient ON patient_journey(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_journey_timestamp ON patient_journey(timestamp);

-- Insert Default Subscription Plans
INSERT INTO subscription_plans (plan_name, price, duration_months, features, max_appointments, discount_percentage) 
VALUES 
    ('Basic', 499.00, 1, '["5 appointments per month", "10% discount on consultation fees", "Free health tips", "Email support"]'::jsonb, 5, 10.00),
    ('Premium', 999.00, 1, '["15 appointments per month", "20% discount on consultation fees", "Priority booking", "Free video consultations (2 per month)", "24/7 chat support", "Free health checkup (annual)"]'::jsonb, 15, 20.00),
    ('Family', 1499.00, 1, '["Unlimited appointments", "25% discount on consultation fees", "Cover up to 5 family members", "All Premium features", "Medicine delivery discount"]'::jsonb, 999, 25.00)
ON CONFLICT (plan_name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_journey ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own health records" ON health_records
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can insert their own health records" ON health_records
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own health records" ON health_records
    FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Users can delete their own health records" ON health_records
    FOR DELETE USING (auth.uid() = patient_id);

CREATE POLICY "Everyone can view doctor time slots" ON doctor_time_slots
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Everyone can view subscription plans" ON subscription_plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own journey" ON patient_journey
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can insert their own journey events" ON patient_journey
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

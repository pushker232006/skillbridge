-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'industry', 'academician', 'institution');
CREATE TYPE application_status AS ENUM ('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected');

-- Institutions table
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL,
    institution_id UUID REFERENCES institutions(id),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Role specific profiles
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    course TEXT,
    branch TEXT,
    year INTEGER,
    cgpa NUMERIC(4,2),
    bio TEXT,
    career_interest TEXT
);

CREATE TABLE industry_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    company_name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    industry TEXT
);

CREATE TABLE faculty_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    department TEXT,
    designation TEXT,
    institution_id UUID REFERENCES institutions(id)
);

-- Skills dictionary
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL
);

-- Student skills
CREATE TABLE student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
    UNIQUE(student_id, skill_id)
);

-- Assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills(id),
    options JSONB NOT NULL,
    correct_option INTEGER NOT NULL
);

CREATE TABLE assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id),
    score INTEGER NOT NULL
);

-- Opportunities
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    remote BOOLEAN DEFAULT false,
    stipend TEXT,
    salary TEXT,
    duration TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE opportunity_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id),
    required_level INTEGER DEFAULT 0
);

-- Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    status application_status DEFAULT 'Applied',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, opportunity_id)
);

-- Learning Programs
CREATE TABLE learning_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    level TEXT,
    certificate BOOLEAN DEFAULT false
);

CREATE TABLE learning_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES learning_programs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id)
);

CREATE TABLE student_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES learning_programs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Enrolled',
    progress INTEGER DEFAULT 0,
    UNIQUE(student_id, program_id)
);

-- Portfolio
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    github_url TEXT,
    project_url TEXT
);

CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT,
    date DATE,
    credential_url TEXT
);

-- Collaborations
CREATE TABLE collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_id UUID NOT NULL REFERENCES profiles(id),
    institution_id UUID NOT NULL REFERENCES institutions(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Active'
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES --
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read institutions
CREATE POLICY "Institutions are viewable by everyone" ON institutions FOR SELECT USING (true);

-- Allow public read of skills
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);

-- Profiles: users can read all profiles (needed for dashboard, applications, etc.), but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Allow service role / triggers to insert profiles (we'll handle user creation securely). Actually, let's just allow authenticated or anon to insert if it matches their auth uid.
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Student Profiles
CREATE POLICY "Student profiles are viewable by everyone" ON student_profiles FOR SELECT USING (true);
CREATE POLICY "Students can update own student_profile" ON student_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Students can insert own student_profile" ON student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Industry Profiles
CREATE POLICY "Industry profiles are viewable by everyone" ON industry_profiles FOR SELECT USING (true);
CREATE POLICY "Industry can update own industry_profile" ON industry_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Industry can insert own industry_profile" ON industry_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Faculty Profiles
CREATE POLICY "Faculty profiles are viewable by everyone" ON faculty_profiles FOR SELECT USING (true);
CREATE POLICY "Faculty can update own faculty_profile" ON faculty_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Faculty can insert own faculty_profile" ON faculty_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Student Skills
CREATE POLICY "Student skills are viewable by everyone" ON student_skills FOR SELECT USING (true);
CREATE POLICY "Students can manage their own skills" ON student_skills FOR ALL USING (auth.uid() = student_id);

-- Assessments (Students only see their own, though maybe institutions need to see? Let's keep it simple for MVP: read all)
CREATE POLICY "Assessments are viewable by everyone" ON assessments FOR SELECT USING (true);
CREATE POLICY "Students can insert own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Assessment results are viewable by everyone" ON assessment_results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert assessment results" ON assessment_results FOR INSERT WITH CHECK (true); -- simplify MVP

CREATE POLICY "Assessment questions are viewable by everyone" ON assessment_questions FOR SELECT USING (true);

-- Opportunities
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Industry can manage their own opportunities" ON opportunities FOR ALL USING (auth.uid() = industry_id);
CREATE POLICY "Opportunity skills are viewable by everyone" ON opportunity_skills FOR SELECT USING (true);
CREATE POLICY "Industry can manage their own opportunity skills" ON opportunity_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_skills.opportunity_id AND industry_id = auth.uid())
);

-- Applications
CREATE POLICY "Users can view relevant applications" ON applications FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM opportunities WHERE id = applications.opportunity_id AND industry_id = auth.uid())
);
CREATE POLICY "Students can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Industry can update application status" ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM opportunities WHERE id = applications.opportunity_id AND industry_id = auth.uid())
);

-- Learning programs
CREATE POLICY "Learning programs are viewable by everyone" ON learning_programs FOR SELECT USING (true);
CREATE POLICY "Industry can manage their own learning programs" ON learning_programs FOR ALL USING (auth.uid() = industry_id);
CREATE POLICY "Learning skills viewable by everyone" ON learning_skills FOR SELECT USING (true);
CREATE POLICY "Industry can manage their own learning skills" ON learning_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM learning_programs WHERE id = learning_skills.program_id AND industry_id = auth.uid())
);

CREATE POLICY "Student learning viewable by everyone" ON student_learning FOR SELECT USING (true);
CREATE POLICY "Students can manage their own learning progress" ON student_learning FOR ALL USING (auth.uid() = student_id);

-- Projects
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Students can manage their own projects" ON projects FOR ALL USING (auth.uid() = student_id);

-- Certifications
CREATE POLICY "Certifications are viewable by everyone" ON certifications FOR SELECT USING (true);
CREATE POLICY "Students can manage their own certifications" ON certifications FOR ALL USING (auth.uid() = student_id);

-- Notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Collaborations
CREATE POLICY "Collaborations are viewable by everyone" ON collaborations FOR SELECT USING (true);

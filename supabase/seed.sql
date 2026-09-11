-- Seed Institutions
INSERT INTO institutions (id, name, location, type) VALUES
('11111111-1111-1111-1111-111111111111', 'Indian Institute of Technology, Bombay', 'Mumbai', 'University'),
('22222222-2222-2222-2222-222222222222', 'National Institute of Technology, Trichy', 'Trichy', 'University');

-- Seed Skills
INSERT INTO skills (id, name, category) VALUES
('00000000-0000-0000-0001-000000000001', 'JavaScript', 'Technical'),
('00000000-0000-0000-0001-000000000002', 'React', 'Technical'),
('00000000-0000-0000-0001-000000000003', 'Node.js', 'Technical'),
('00000000-0000-0000-0001-000000000004', 'Python', 'Technical'),
('00000000-0000-0000-0001-000000000005', 'Java', 'Technical'),
('00000000-0000-0000-0001-000000000006', 'SQL', 'Technical'),
('00000000-0000-0000-0001-000000000007', 'Git', 'Technical'),
('00000000-0000-0000-0001-000000000008', 'AWS', 'Technical'),
('00000000-0000-0000-0001-000000000009', 'System Design', 'Technical'),
('00000000-0000-0000-0001-000000000010', 'Communication', 'Soft'),
('00000000-0000-0000-0001-000000000011', 'Problem Solving', 'Soft'),
('00000000-0000-0000-0001-000000000012', 'Teamwork', 'Soft');

-- Seed Assessment Questions
INSERT INTO assessment_questions (question, skill_id, options, correct_option) VALUES
('Which keyword is used to declare a block-scoped variable in JavaScript?', '00000000-0000-0000-0001-000000000001', '["var", "let", "function", "int"]', 1),
('In React, what hook is used to manage state?', '00000000-0000-0000-0001-000000000002', '["useEffect", "useState", "useContext", "useReducer"]', 1),
('Which of the following is NOT a core module in Node.js?', '00000000-0000-0000-0001-000000000003', '["http", "fs", "path", "express"]', 3),
('What is the command to initialize a new git repository?', '00000000-0000-0000-0001-000000000007', '["git start", "git init", "git new", "git create"]', 1),
('In SQL, which clause is used to filter records before grouping?', '00000000-0000-0000-0001-000000000006', '["WHERE", "HAVING", "FILTER", "SORT"]', 0),
('Which of the following is a dynamically typed language?', '00000000-0000-0000-0001-000000000004', '["Java", "C++", "Python", "C#"]', 2),
('What does AWS stand for?', '00000000-0000-0000-0001-000000000008', '["Amazon Web Server", "Amazon Web Services", "Automated Web Services", "Amazon Wireless Services"]', 1),
('Which Java keyword is used to inherit a class?', '00000000-0000-0000-0001-000000000005', '["implement", "extends", "inherit", "super"]', 1),
('What is the primary purpose of a Load Balancer in System Design?', '00000000-0000-0000-0001-000000000009', '["To store files securely", "To route traffic to multiple servers", "To compile code faster", "To handle database schema changes"]', 1),
('Which hook is used to perform side effects in a functional React component?', '00000000-0000-0000-0001-000000000002', '["useSideEffect", "useEffect", "useAction", "useMemo"]', 1);


-- NOTE: To insert into auth.users properly requires hashing the password. 
-- For a demo environment, we will provide instructions in README to register the users first, 
-- or we can inject raw mocked UUIDs for opportunities to make the marketplace look full.

-- Let's mock an industry user ID for the sake of having dummy opportunities.
-- (This user won't be loginable, but their opportunities will show up)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, aud, role, created_at, updated_at) 
VALUES ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'mock_industry@skillbridge.demo', 'mock', 'authenticated', 'authenticated', now(), now());

INSERT INTO profiles (id, email, name, role) VALUES
('33333333-3333-3333-3333-333333333333', 'mock_industry@skillbridge.demo', 'TechCorp India', 'industry');

INSERT INTO industry_profiles (user_id, company_name, description, website, industry) VALUES
('33333333-3333-3333-3333-333333333333', 'TechCorp India', 'Leading software solutions provider in India.', 'https://techcorp.example.com', 'IT Services');

-- Mock Opportunities
INSERT INTO opportunities (id, industry_id, type, title, description, location, remote, stipend, duration, status) VALUES
('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333333', 'Internship', 'Frontend Developer Intern', 'Join our team to build scalable React applications.', 'Bangalore', false, '₹20,000/month', '6 Months', 'Open'),
('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333333', 'Full-time', 'Backend Engineer (Node.js)', 'Looking for strong Node.js developers for our core API team.', 'Remote', true, '₹12,00,000/year', 'Full-time', 'Open'),
('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333', 'Internship', 'Data Science Intern', 'Work on cutting-edge ML models.', 'Pune', false, '₹25,000/month', '3 Months', 'Open');

-- Mock Opportunity Skills
INSERT INTO opportunity_skills (opportunity_id, skill_id, required_level) VALUES
('44444444-4444-4444-4444-444444444441', '00000000-0000-0000-0001-000000000001', 70), -- JS
('44444444-4444-4444-4444-444444444441', '00000000-0000-0000-0001-000000000002', 80), -- React
('44444444-4444-4444-4444-444444444442', '00000000-0000-0000-0001-000000000003', 85), -- Node.js
('44444444-4444-4444-4444-444444444442', '00000000-0000-0000-0001-000000000006', 75), -- SQL
('44444444-4444-4444-4444-444444444443', '00000000-0000-0000-0001-000000000004', 80); -- Python

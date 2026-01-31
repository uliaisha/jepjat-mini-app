-- Insert default admin user
-- Password: admin123 (bcrypt hashed)
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$rM.5X5YnNfWLYl9J0L4dCOQQJ5KP5nGhWYpv0CQJX9n.7rWlG6.Ky')
ON CONFLICT (username) DO NOTHING;

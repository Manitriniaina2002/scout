#!/usr/bin/env python3
"""
Database migration script to add User table for authentication.
Run this script to initialize the database with the User model.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app.models import User
from sqlalchemy import text

def create_user_table():
    """Create the user table if it doesn't exist"""
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ User table created successfully")

        # Create default admin user
        from sqlalchemy.orm import sessionmaker
        import hashlib

        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()

        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("ℹ️  Admin user already exists - updating password hash")
            # Update password hash to use new method
            hashed_password = hashlib.sha256("admin123".encode()).hexdigest()
            existing_admin.hashed_password = hashed_password
            db.commit()
            print("✅ Admin user password updated")
        else:
            # Create default admin user
            hashed_password = hashlib.sha256("admin123".encode()).hexdigest()

            admin_user = User(
                username="admin",
                email="admin@example.com",
                hashed_password=hashed_password,
                role="admin",
                is_active=True
            )

            db.add(admin_user)
            db.commit()
            print("✅ Default admin user created:")
            print("   Username: admin")
            print("   Password: admin123")
            print("   ⚠️  Please change the default password after first login!")

        db.close()

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

    return True

if __name__ == "__main__":
    print("🔄 Initializing database with User authentication...")
    success = create_user_table()
    if success:
        print("🎉 Database migration completed successfully!")
    else:
        print("💥 Database migration failed!")
        sys.exit(1)
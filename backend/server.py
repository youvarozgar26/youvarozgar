from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============================================
# Data Models
# ============================================

class UserCreate(BaseModel):
    name: str
    mobile: str
    job_category: str
    location: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    mobile: str
    job_category: str
    location: str
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OTPRequest(BaseModel):
    mobile: str

class OTPVerify(BaseModel):
    mobile: str
    otp: str

class OTPResponse(BaseModel):
    success: bool
    message: str

class JobCategory(BaseModel):
    id: str
    name_en: str
    name_hi: str
    icon: str

class Location(BaseModel):
    id: str
    city_en: str
    city_hi: str
    state_en: str
    state_hi: str

class JobCreate(BaseModel):
    title: str
    description: str
    category: str
    location: str
    salary_min: int
    salary_max: int
    employer_name: str
    employer_mobile: str

class Job(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    location: str
    salary_min: int
    salary_max: int
    employer_name: str
    employer_mobile: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

# In-memory OTP storage (for demo - in production use Redis)
otp_storage = {}

# ============================================
# Job Categories Data
# ============================================
JOB_CATEGORIES = [
    {"id": "waiter", "name_en": "Waiter", "name_hi": "वेटर", "icon": "restaurant"},
    {"id": "helper", "name_en": "Helper", "name_hi": "हेल्पर", "icon": "handshake"},
    {"id": "labour", "name_en": "Labour", "name_hi": "मजदूर", "icon": "construction"},
    {"id": "sales", "name_en": "Sales Staff", "name_hi": "सेल्स स्टाफ", "icon": "storefront"},
    {"id": "factory", "name_en": "Factory Worker", "name_hi": "फैक्ट्री वर्कर", "icon": "factory"},
    {"id": "driver", "name_en": "Driver", "name_hi": "ड्राइवर", "icon": "local-taxi"},
    {"id": "security", "name_en": "Security Guard", "name_hi": "सिक्योरिटी गार्ड", "icon": "security"},
    {"id": "cleaning", "name_en": "Cleaning Staff", "name_hi": "सफाई कर्मचारी", "icon": "cleaning-services"},
]

# ============================================
# Locations Data (Major Indian Cities)
# ============================================
LOCATIONS = [
    {"id": "delhi", "city_en": "Delhi", "city_hi": "दिल्ली", "state_en": "Delhi", "state_hi": "दिल्ली"},
    {"id": "mumbai", "city_en": "Mumbai", "city_hi": "मुंबई", "state_en": "Maharashtra", "state_hi": "महाराष्ट्र"},
    {"id": "bangalore", "city_en": "Bangalore", "city_hi": "बैंगलोर", "state_en": "Karnataka", "state_hi": "कर्नाटक"},
    {"id": "hyderabad", "city_en": "Hyderabad", "city_hi": "हैदराबाद", "state_en": "Telangana", "state_hi": "तेलंगाना"},
    {"id": "chennai", "city_en": "Chennai", "city_hi": "चेन्नई", "state_en": "Tamil Nadu", "state_hi": "तमिल नाडु"},
    {"id": "kolkata", "city_en": "Kolkata", "city_hi": "कोलकाता", "state_en": "West Bengal", "state_hi": "पश्चिम बंगाल"},
    {"id": "pune", "city_en": "Pune", "city_hi": "पुणे", "state_en": "Maharashtra", "state_hi": "महाराष्ट्र"},
    {"id": "ahmedabad", "city_en": "Ahmedabad", "city_hi": "अहमदाबाद", "state_en": "Gujarat", "state_hi": "गुजरात"},
    {"id": "jaipur", "city_en": "Jaipur", "city_hi": "जयपुर", "state_en": "Rajasthan", "state_hi": "राजस्थान"},
    {"id": "lucknow", "city_en": "Lucknow", "city_hi": "लखनऊ", "state_en": "Uttar Pradesh", "state_hi": "उत्तर प्रदेश"},
    {"id": "noida", "city_en": "Noida", "city_hi": "नोएडा", "state_en": "Uttar Pradesh", "state_hi": "उत्तर प्रदेश"},
    {"id": "gurgaon", "city_en": "Gurgaon", "city_hi": "गुड़गांव", "state_en": "Haryana", "state_hi": "हरियाणा"},
]

# ============================================
# API Routes
# ============================================

@api_router.get("/")
async def root():
    return {"message": "Youvarozgar API - Welcome!"}

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# ============================================
# Job Categories Routes
# ============================================

@api_router.get("/job-categories", response_model=List[JobCategory])
async def get_job_categories():
    """Get all available job categories"""
    return [JobCategory(**cat) for cat in JOB_CATEGORIES]

# ============================================
# Locations Routes
# ============================================

@api_router.get("/locations", response_model=List[Location])
async def get_locations():
    """Get all available locations"""
    return [Location(**loc) for loc in LOCATIONS]

# ============================================
# OTP Routes
# ============================================

@api_router.post("/send-otp", response_model=OTPResponse)
async def send_otp(request: OTPRequest):
    """Send OTP to mobile number (mock implementation)"""
    mobile = request.mobile
    
    # Validate mobile number format
    if not mobile or len(mobile) < 10:
        raise HTTPException(status_code=400, detail="Invalid mobile number")
    
    # Generate OTP (for demo, always use 1234)
    otp = "1234"
    
    # Store OTP
    otp_storage[mobile] = {
        "otp": otp,
        "created_at": datetime.utcnow(),
        "attempts": 0
    }
    
    # In production, send SMS via Twilio/MSG91
    logging.info(f"OTP sent to {mobile}: {otp}")
    
    return OTPResponse(success=True, message="OTP भेज दिया गया है (OTP sent successfully)")

@api_router.post("/verify-otp", response_model=OTPResponse)
async def verify_otp(request: OTPVerify):
    """Verify OTP"""
    mobile = request.mobile
    otp = request.otp
    
    # For demo, accept 1234 as valid OTP
    if otp == "1234":
        return OTPResponse(success=True, message="OTP सही है (OTP verified successfully)")
    
    # Check stored OTP
    stored = otp_storage.get(mobile)
    if not stored:
        return OTPResponse(success=False, message="कृपया पहले OTP भेजें (Please request OTP first)")
    
    if stored["otp"] == otp:
        # Clear OTP after successful verification
        del otp_storage[mobile]
        return OTPResponse(success=True, message="OTP सही है (OTP verified successfully)")
    
    return OTPResponse(success=False, message="गलत OTP, दुबारा कोशिश करें (Invalid OTP, please try again)")

# ============================================
# User Routes
# ============================================

@api_router.post("/users/register", response_model=User)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    # Check if mobile already exists
    existing = await db.users.find_one({"mobile": user_data.mobile})
    if existing:
        raise HTTPException(status_code=400, detail="इस नंबर से पहले से रजिस्ट्रेशन है (This mobile is already registered)")
    
    # Create user
    user = User(
        name=user_data.name,
        mobile=user_data.mobile,
        job_category=user_data.job_category,
        location=user_data.location,
        is_verified=True
    )
    
    await db.users.insert_one(user.dict())
    return user

@api_router.get("/users", response_model=List[User])
async def get_users(
    category: Optional[str] = None,
    location: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get all registered users (Admin endpoint)"""
    query = {}
    if category:
        query["job_category"] = category
    if location:
        query["location"] = location
    
    users = await db.users.find(query).skip(skip).limit(limit).to_list(limit)
    return [User(**user) for user in users]

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@api_router.get("/users/mobile/{mobile}", response_model=User)
async def get_user_by_mobile(mobile: str):
    """Get user by mobile number"""
    user = await db.users.find_one({"mobile": mobile})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

# ============================================
# Jobs Routes
# ============================================

@api_router.post("/jobs", response_model=Job)
async def create_job(job_data: JobCreate):
    """Create a new job posting (Admin/Employer endpoint)"""
    job = Job(**job_data.dict())
    await db.jobs.insert_one(job.dict())
    return job

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(
    category: Optional[str] = None,
    location: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    """Get all active jobs"""
    query = {"is_active": True}
    if category:
        query["category"] = category
    if location:
        query["location"] = location
    
    jobs = await db.jobs.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return [Job(**job) for job in jobs]

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    """Get job by ID"""
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return Job(**job)

@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """Delete/deactivate a job"""
    result = await db.jobs.update_one(
        {"id": job_id},
        {"$set": {"is_active": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}

# ============================================
# Stats Route (Admin)
# ============================================

@api_router.get("/stats")
async def get_stats():
    """Get dashboard statistics"""
    total_users = await db.users.count_documents({})
    total_jobs = await db.jobs.count_documents({"is_active": True})
    
    # Get users by category
    users_by_category = {}
    for cat in JOB_CATEGORIES:
        count = await db.users.count_documents({"job_category": cat["id"]})
        users_by_category[cat["id"]] = count
    
    # Get users by location
    users_by_location = {}
    for loc in LOCATIONS:
        count = await db.users.count_documents({"location": loc["id"]})
        if count > 0:
            users_by_location[loc["id"]] = count
    
    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "users_by_category": users_by_category,
        "users_by_location": users_by_location
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

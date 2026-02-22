#!/usr/bin/env python3
"""
Backend API Testing Script for Youvarozgar App
Tests all backend endpoints with realistic data
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://avtar-register.preview.emergentagent.com/api"

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response"] = response_data
        
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        
    def test_health_check(self):
        """Test 1: Health Check API"""
        try:
            response = self.session.get(f"{BACKEND_URL}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_result("Health Check", True, f"Health check passed - Status: {data['status']}")
                else:
                    self.log_result("Health Check", False, f"Unexpected response format: {data}")
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")

    def test_job_categories(self):
        """Test 2: Job Categories API"""
        try:
            response = self.session.get(f"{BACKEND_URL}/job-categories", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 8:
                    # Check if all required fields are present in first category
                    if data and all(key in data[0] for key in ["id", "name_en", "name_hi", "icon"]):
                        categories = [cat["name_en"] for cat in data]
                        self.log_result("Job Categories", True, f"Got 8 categories: {', '.join(categories[:3])}...")
                    else:
                        self.log_result("Job Categories", False, f"Missing required fields in categories: {data[0] if data else 'Empty'}")
                else:
                    self.log_result("Job Categories", False, f"Expected 8 categories, got {len(data) if isinstance(data, list) else 'non-array'}")
            else:
                self.log_result("Job Categories", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Job Categories", False, f"Connection error: {str(e)}")

    def test_locations(self):
        """Test 3: Locations API"""
        try:
            response = self.session.get(f"{BACKEND_URL}/locations", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 12:
                    # Check if all required fields are present
                    if data and all(key in data[0] for key in ["id", "city_en", "city_hi", "state_en", "state_hi"]):
                        cities = [loc["city_en"] for loc in data]
                        self.log_result("Locations", True, f"Got 12 cities: {', '.join(cities[:3])}...")
                    else:
                        self.log_result("Locations", False, f"Missing required fields in locations: {data[0] if data else 'Empty'}")
                else:
                    self.log_result("Locations", False, f"Expected 12 locations, got {len(data) if isinstance(data, list) else 'non-array'}")
            else:
                self.log_result("Locations", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Locations", False, f"Connection error: {str(e)}")

    def test_send_otp(self):
        """Test 4: Send OTP API"""
        try:
            # Test with valid mobile number
            payload = {"mobile": "9876543210"}
            response = self.session.post(f"{BACKEND_URL}/send-otp", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "message" in data:
                    self.log_result("Send OTP", True, f"OTP sent successfully: {data['message']}")
                else:
                    self.log_result("Send OTP", False, f"Unexpected response: {data}")
            else:
                self.log_result("Send OTP", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Send OTP", False, f"Connection error: {str(e)}")

    def test_verify_otp(self):
        """Test 5: Verify OTP API - both valid and invalid"""
        try:
            # Test with valid OTP (1234)
            payload = {"mobile": "9876543210", "otp": "1234"}
            response = self.session.post(f"{BACKEND_URL}/verify-otp", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_result("Verify OTP (Valid)", True, f"Valid OTP accepted: {data['message']}")
                else:
                    self.log_result("Verify OTP (Valid)", False, f"Valid OTP rejected: {data}")
            else:
                self.log_result("Verify OTP (Valid)", False, f"HTTP {response.status_code}: {response.text}")
            
            # Test with invalid OTP
            payload = {"mobile": "9876543210", "otp": "0000"}
            response = self.session.post(f"{BACKEND_URL}/verify-otp", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if not data.get("success"):
                    self.log_result("Verify OTP (Invalid)", True, f"Invalid OTP correctly rejected: {data['message']}")
                else:
                    self.log_result("Verify OTP (Invalid)", False, f"Invalid OTP incorrectly accepted: {data}")
            else:
                self.log_result("Verify OTP (Invalid)", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Verify OTP", False, f"Connection error: {str(e)}")

    def test_register_user(self):
        """Test 6: User Registration API"""
        try:
            # Test with new user
            payload = {
                "name": "राज कुमार",
                "mobile": "9123456789", 
                "job_category": "waiter",
                "location": "delhi"
            }
            response = self.session.post(f"{BACKEND_URL}/users/register", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["name"] == "राज कुमार":
                    self.log_result("Register User (New)", True, f"User registered with ID: {data['id']}")
                    
                    # Test duplicate registration with same mobile
                    dup_response = self.session.post(f"{BACKEND_URL}/users/register", json=payload, timeout=10)
                    if dup_response.status_code == 400:
                        self.log_result("Register User (Duplicate)", True, "Duplicate mobile correctly rejected")
                    else:
                        self.log_result("Register User (Duplicate)", False, f"Duplicate not handled: HTTP {dup_response.status_code}")
                else:
                    self.log_result("Register User (New)", False, f"Invalid user response: {data}")
            else:
                self.log_result("Register User (New)", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Register User", False, f"Connection error: {str(e)}")

    def test_get_users(self):
        """Test 7: Get Users API with filters"""
        try:
            # Test get all users
            response = self.session.get(f"{BACKEND_URL}/users", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Users (All)", True, f"Retrieved {len(data)} users")
                    
                    # Test with category filter
                    filtered_response = self.session.get(f"{BACKEND_URL}/users?category=waiter", timeout=10)
                    if filtered_response.status_code == 200:
                        filtered_data = filtered_response.json()
                        self.log_result("Get Users (Category Filter)", True, f"Found {len(filtered_data)} waiters")
                    else:
                        self.log_result("Get Users (Category Filter)", False, f"Filter failed: HTTP {filtered_response.status_code}")
                    
                    # Test with location filter
                    location_response = self.session.get(f"{BACKEND_URL}/users?location=delhi", timeout=10)
                    if location_response.status_code == 200:
                        location_data = location_response.json()
                        self.log_result("Get Users (Location Filter)", True, f"Found {len(location_data)} users in Delhi")
                    else:
                        self.log_result("Get Users (Location Filter)", False, f"Location filter failed: HTTP {location_response.status_code}")
                else:
                    self.log_result("Get Users (All)", False, f"Expected array, got: {type(data)}")
            else:
                self.log_result("Get Users (All)", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Get Users", False, f"Connection error: {str(e)}")

    def test_stats(self):
        """Test 8: Stats API"""
        try:
            response = self.session.get(f"{BACKEND_URL}/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_users", "total_jobs", "users_by_category", "users_by_location"]
                if all(field in data for field in required_fields):
                    self.log_result("Stats API", True, f"Stats: {data['total_users']} users, {data['total_jobs']} jobs")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Stats API", False, f"Missing fields: {missing}")
            else:
                self.log_result("Stats API", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Stats API", False, f"Connection error: {str(e)}")

    def test_create_job(self):
        """Test 9: Create Job API"""
        try:
            payload = {
                "title": "रेस्टोरेंट में वेटर की जरूरत",
                "description": "अनुभवी वेटर की तत्काल आवश्यकता। अच्छा व्यवहार और हिंदी/अंग्रेजी बोलना जरूरी।",
                "category": "waiter",
                "location": "delhi",
                "salary_min": 12000,
                "salary_max": 18000,
                "employer_name": "राम रेस्टोरेंट",
                "employer_mobile": "9987654321"
            }
            response = self.session.post(f"{BACKEND_URL}/jobs", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["title"] == payload["title"]:
                    self.log_result("Create Job", True, f"Job created with ID: {data['id']}")
                else:
                    self.log_result("Create Job", False, f"Invalid job response: {data}")
            else:
                self.log_result("Create Job", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Create Job", False, f"Connection error: {str(e)}")

    def test_get_jobs(self):
        """Test 10: Get Jobs API with filters"""
        try:
            # Test get all jobs
            response = self.session.get(f"{BACKEND_URL}/jobs", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Jobs (All)", True, f"Retrieved {len(data)} active jobs")
                    
                    # Test with category filter
                    filtered_response = self.session.get(f"{BACKEND_URL}/jobs?category=waiter", timeout=10)
                    if filtered_response.status_code == 200:
                        filtered_data = filtered_response.json()
                        self.log_result("Get Jobs (Category Filter)", True, f"Found {len(filtered_data)} waiter jobs")
                    else:
                        self.log_result("Get Jobs (Category Filter)", False, f"Filter failed: HTTP {filtered_response.status_code}")
                    
                    # Test with location filter
                    location_response = self.session.get(f"{BACKEND_URL}/jobs?location=delhi", timeout=10)
                    if location_response.status_code == 200:
                        location_data = location_response.json()
                        self.log_result("Get Jobs (Location Filter)", True, f"Found {len(location_data)} jobs in Delhi")
                    else:
                        self.log_result("Get Jobs (Location Filter)", False, f"Location filter failed: HTTP {location_response.status_code}")
                else:
                    self.log_result("Get Jobs (All)", False, f"Expected array, got: {type(data)}")
            else:
                self.log_result("Get Jobs (All)", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Get Jobs", False, f"Connection error: {str(e)}")

    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🧪 Starting Backend API Tests for Youvarozgar App")
        print(f"Backend URL: {BACKEND_URL}")
        print("-" * 80)
        
        # Run all tests in sequence
        self.test_health_check()
        self.test_job_categories()
        self.test_locations()
        self.test_send_otp()
        self.test_verify_otp()
        self.test_register_user()
        self.test_get_users()
        self.test_stats()
        self.test_create_job()
        self.test_get_jobs()
        
        # Summary
        print("-" * 80)
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"📊 Test Summary: {passed_tests}/{total_tests} tests passed")
        
        if failed_tests > 0:
            print(f"\n❌ Failed Tests ({failed_tests}):")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        # Return success status
        return failed_tests == 0

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    
    # Write detailed results to file
    with open('/app/test_results_backend.json', 'w', encoding='utf-8') as f:
        json.dump(tester.test_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n📄 Detailed results saved to: /app/test_results_backend.json")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)
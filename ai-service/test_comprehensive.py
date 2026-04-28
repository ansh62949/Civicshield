"""
CivicSense AI Service - Test Script

Tests all endpoints to verify the service is working correctly.
Run this after starting the service: python test_comprehensive.py
"""

import requests
import json
from pathlib import Path
import time

BASE_URL = "http://localhost:8000"

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def test_health():
    """Test /health endpoint"""
    print_header("TEST 1: Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200, "Health check failed"
        assert response.json()["status"] == "ok", "Status is not ok"
        print("\n✓ Health check PASSED")
        return True
    except Exception as e:
        print(f"\n✗ Health check FAILED: {e}")
        return False

def test_classify_text_only():
    """Test /classify with text only (no image)"""
    print_header("TEST 2: Classify Text Only")
    
    try:
        data = {
            "content": "There is a large pothole on Main Street that is causing damage to vehicles"
        }
        response = requests.post(f"{BASE_URL}/classify", data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Request: {data}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        result = response.json()
        assert "category" in result, "Missing 'category' in response"
        assert "severity" in result, "Missing 'severity' in response"
        print("\n✓ Text classification PASSED")
        return True
    except Exception as e:
        print(f"\n✗ Text classification FAILED: {e}")
        return False

def test_classify_with_image():
    """Test /classify with both image and text"""
    print_header("TEST 3: Classify with Image & Text")
    
    try:
        # Create a simple test image
        from PIL import Image
        import io
        
        test_image = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        test_image.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {
            'image': ('test.png', img_bytes, 'image/png'),
        }
        data = {
            'content': 'Water is leaking from the main pipeline on Oak Avenue'
        }
        
        response = requests.post(f"{BASE_URL}/classify", files=files, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        result = response.json()
        assert "category" in result, "Missing 'category'"
        assert "civicImpactScore" in result, "Missing 'civicImpactScore'"
        print("\n✓ Image + text classification PASSED")
        return True
    except Exception as e:
        print(f"\n✗ Image + text classification FAILED: {e}")
        return False

def test_analyze():
    """Test /analyze endpoint"""
    print_header("TEST 4: Analyze Complaint")
    
    try:
        from PIL import Image
        import io
        
        # Create a simple test image
        test_image = Image.new('RGB', (100, 100), color='green')
        img_bytes = io.BytesIO()
        test_image.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {
            'image': ('complaint.png', img_bytes, 'image/png'),
        }
        data = {
            'latitude': 28.6139,
            'longitude': 77.2090,
            'zoneType': 'Hospital'
        }
        
        response = requests.post(f"{BASE_URL}/analyze", files=files, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Request Data: {data}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        result = response.json()
        assert "issueType" in result, "Missing 'issueType'"
        assert "priority" in result, "Missing 'priority'"
        assert "tensionScore" in result, "Missing 'tensionScore'"
        print("\n✓ Complaint analysis PASSED")
        return True
    except Exception as e:
        print(f"\n✗ Complaint analysis FAILED: {e}")
        return False

def test_tension():
    """Test /tension/{state} endpoint"""
    print_header("TEST 5: Get Tension Score")
    
    try:
        # Test with different states
        states = ["Delhi", "Uttar Pradesh", "Tamil Nadu"]
        
        for state in states:
            response = requests.get(f"{BASE_URL}/tension/{state}")
            print(f"\nState: {state}")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            
            assert response.status_code == 200, f"Unexpected status for {state}"
            result = response.json()
            assert "tensionScore" in result, f"Missing 'tensionScore' for {state}"
            assert "state" in result, f"Missing 'state' field"
        
        print("\n✓ Tension score endpoint PASSED")
        return True
    except Exception as e:
        print(f"\n✗ Tension score endpoint FAILED: {e}")
        return False

def test_root():
    """Test root endpoint"""
    print_header("TEST 6: Root Endpoint")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200, "Root endpoint failed"
        result = response.json()
        assert "service" in result, "Missing 'service' field"
        print("\n✓ Root endpoint PASSED")
        return True
    except Exception as e:
        print(f"\n✗ Root endpoint FAILED: {e}")
        return False

def main():
    print("\n")
    print("╔══════════════════════════════════════════════════════════╗")
    print("║        CivicSense AI Service - Comprehensive Tests       ║")
    print("╚══════════════════════════════════════════════════════════╝")
    
    # Check if service is running
    print("\nChecking if service is running at", BASE_URL, "...", end=" ")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print("✓ Service is running!")
    except Exception as e:
        print(f"\n✗ Cannot connect to service at {BASE_URL}")
        print(f"Error: {e}")
        print("\nPlease start the service first:")
        print("  python app.py")
        print("  OR")
        print("  bash start.sh  (Linux/Mac)")
        print("  OR")
        print("  start.bat  (Windows)")
        return
    
    # Run all tests
    results = {
        "Health Check": test_health(),
        "Text Classification": test_classify_text_only(),
        "Image + Text Classification": test_classify_with_image(),
        "Complaint Analysis": test_analyze(),
        "Tension Score": test_tension(),
        "Root Endpoint": test_root(),
    }
    
    # Print summary
    print_header("Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_flag in results.items():
        status = "✓ PASSED" if passed_flag else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Service is working correctly!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the output above.")

if __name__ == "__main__":
    main()

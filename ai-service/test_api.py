"""
Test script for CivicShield AI Service API endpoints.
"""

import requests
import json
from pathlib import Path
from typing import Dict, Any

BASE_URL = "http://localhost:5000"

# Sample test data
TEST_DATA = {
    "latitude": 28.5244,
    "longitude": 77.3958,
    "zoneType": "Residential",
}

ZONES_TO_TEST = [
    ("Residential", 28.5244, 77.3958),
    ("Hospital", 28.5570, 77.4045),
    ("School", 28.5586, 77.4062),
    ("Market", 28.5735, 77.3650),
    ("Commercial", 28.4740, 77.5395),
]


def test_health_check():
    """Test the health check endpoint."""
    print("\n" + "="*60)
    print("Testing: GET /health")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 200, "Health check failed"
        print("✓ Health check passed")
        return True
    except Exception as e:
        print(f"✗ Health check failed: {str(e)}")
        return False


def test_analyze_with_dummy_image():
    """Test the analyze endpoint with a dummy image."""
    print("\n" + "="*60)
    print("Testing: POST /analyze (Dummy Image)")
    print("="*60)
    
    try:
        # Create a minimal dummy image (1x1 red pixel PNG)
        dummy_image_data = (
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
            b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00'
            b'\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00\x03\x01\x01\x00'
            b'\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        )
        
        files = {
            'image': ('test.png', dummy_image_data, 'image/png'),
        }
        
        data = {
            'latitude': TEST_DATA['latitude'],
            'longitude': TEST_DATA['longitude'],
            'zoneType': TEST_DATA['zoneType'],
        }
        
        response = requests.post(f"{BASE_URL}/analyze", files=files, data=data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        result = response.json()
        assert 'issueType' in result, "Missing issueType"
        assert 'confidence' in result, "Missing confidence"
        assert 'tensionScore' in result, "Missing tensionScore"
        assert 'priority' in result, "Missing priority"
        
        print("✓ Analyze endpoint passed")
        return True
    except Exception as e:
        print(f"✗ Analyze endpoint failed: {str(e)}")
        return False


def test_analyze_all_zones():
    """Test analyze endpoint with different zones."""
    print("\n" + "="*60)
    print("Testing: POST /analyze (All Zones)")
    print("="*60)
    
    results = []
    
    # Create a minimal dummy image
    dummy_image_data = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
        b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00'
        b'\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00\x03\x01\x01\x00'
        b'\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    
    for zone_type, lat, lon in ZONES_TO_TEST:
        try:
            files = {
                'image': ('test.png', dummy_image_data, 'image/png'),
            }
            
            data = {
                'latitude': lat,
                'longitude': lon,
                'zoneType': zone_type,
            }
            
            response = requests.post(f"{BASE_URL}/analyze", files=files, data=data)
            
            assert response.status_code == 200
            result = response.json()
            
            print(f"\n{zone_type}:")
            print(f"  Issue: {result.get('issueType')}")
            print(f"  Priority: {result.get('priority')}")
            print(f"  Tension: {result.get('tensionScore'):.1f}")
            print(f"  Confidence: {result.get('confidence'):.2f}")
            
            results.append((zone_type, result.get('priority')))
        except Exception as e:
            print(f"✗ Failed for zone {zone_type}: {str(e)}")
    
    print("\n✓ Zone testing completed")
    return len(results) == len(ZONES_TO_TEST)


def test_priority_distribution():
    """Test priority distribution across multiple calls."""
    print("\n" + "="*60)
    print("Testing: Priority Distribution")
    print("="*60)
    
    dummy_image_data = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
        b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00'
        b'\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00\x03\x01\x01\x00'
        b'\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    
    priority_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    num_requests = 10
    
    print(f"Making {num_requests} requests for Hospital zone...")
    
    for i in range(num_requests):
        try:
            files = {
                'image': ('test.png', dummy_image_data, 'image/png'),
            }
            
            data = {
                'latitude': 28.5570,
                'longitude': 77.4045,
                'zoneType': 'Hospital',
            }
            
            response = requests.post(f"{BASE_URL}/analyze", files=files, data=data)
            result = response.json()
            priority = result.get('priority')
            priority_counts[priority] += 1
            print(f"  Request {i+1}: {priority}")
        except Exception as e:
            print(f"  Request {i+1}: Failed - {str(e)}")
    
    print("\nPriority Distribution:")
    for priority, count in priority_counts.items():
        percentage = (count / num_requests) * 100
        print(f"  {priority}: {count} ({percentage:.1f}%)")
    
    print("✓ Priority distribution test completed")
    return True


def print_summary(results: Dict[str, bool]):
    """Print test summary."""
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    total_tests = len(results)
    passed_tests = sum(1 for v in results.values() if v)
    
    for test_name, result in results.items():
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    print(f"\nTotal: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {total_tests - passed_tests} test(s) failed")


def main():
    """Run all tests."""
    print("\n" + "="*60)
    print("CivicShield AI Service - API Test Suite")
    print("="*60)
    print(f"Base URL: {BASE_URL}")
    
    results = {}
    
    # Test 1: Health Check
    results["Health Check"] = test_health_check()
    
    # Test 2: Analyze with Dummy Image
    results["Analyze (Dummy Image)"] = test_analyze_with_dummy_image()
    
    # Test 3: Analyze All Zones
    results["Analyze (All Zones)"] = test_analyze_all_zones()
    
    # Test 4: Priority Distribution
    results["Priority Distribution"] = test_priority_distribution()
    
    # Print summary
    print_summary(results)


if __name__ == "__main__":
    main()

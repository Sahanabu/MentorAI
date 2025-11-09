import json
import random
import math
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

class AIServiceHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy"}).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            self.send_error(400, "Invalid JSON")
            return
        
        if self.path == '/predict/subject':
            response = self.predict_subject(data)
        elif self.path == '/predict/sgpa':
            response = self.predict_sgpa(data)
        else:
            self.send_error(404, "Endpoint not found")
            return
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def predict_subject(self, data):
        # Extract features
        attendance = data.get('attendance_percentage', 75)
        internals = data.get('best_of_two_internals', 15)
        assignments = data.get('assignment_marks', 8)
        behavior = data.get('behavior_score', 8)
        
        # Simple prediction algorithm
        base_score = (attendance * 0.4) + (internals * 2) + (assignments * 2.5) + (behavior * 2.5)
        
        # Add some randomness for realism
        noise = random.uniform(-5, 5)
        predicted_score = max(0, min(100, base_score + noise))
        
        # Calculate confidence based on input quality
        confidence = 0.7 + (attendance / 100) * 0.2 + (internals / 20) * 0.1
        confidence = min(0.95, confidence)
        
        # Determine risk level
        if predicted_score >= 70 and attendance >= 80:
            risk_level = 'SAFE'
        elif predicted_score >= 50 and attendance >= 70:
            risk_level = 'NEEDS_ATTENTION'
        else:
            risk_level = 'AT_RISK'
        
        return {
            'predicted_score': round(predicted_score, 2),
            'confidence': round(confidence, 3),
            'risk_level': risk_level,
            'model_version': '1.0.0'
        }
    
    def predict_sgpa(self, data):
        subjects = data.get('subjects', [])
        
        if not subjects:
            return {'error': 'No subjects provided'}
        
        total_credits = 0
        weighted_sum = 0
        
        for subject in subjects:
            credits = subject.get('credits', 3)
            
            # Get subject prediction
            subject_data = {
                'attendance_percentage': subject.get('attendance_percentage', 75),
                'best_of_two_internals': subject.get('best_of_two_internals', 15),
                'assignment_marks': subject.get('assignment_marks', 8),
                'behavior_score': subject.get('behavior_score', 8)
            }
            
            subject_prediction = self.predict_subject(subject_data)
            predicted_marks = subject_prediction['predicted_score']
            
            # Convert marks to grade points (10-point scale)
            if predicted_marks >= 90:
                grade_points = 10
            elif predicted_marks >= 80:
                grade_points = 9
            elif predicted_marks >= 70:
                grade_points = 8
            elif predicted_marks >= 60:
                grade_points = 7
            elif predicted_marks >= 50:
                grade_points = 6
            elif predicted_marks >= 45:
                grade_points = 5
            elif predicted_marks >= 40:
                grade_points = 4
            else:
                grade_points = 0
            
            weighted_sum += grade_points * credits
            total_credits += credits
        
        predicted_sgpa = weighted_sum / total_credits if total_credits > 0 else 0
        
        # Calculate confidence
        avg_confidence = sum(self.predict_subject({
            'attendance_percentage': s.get('attendance_percentage', 75),
            'best_of_two_internals': s.get('best_of_two_internals', 15),
            'assignment_marks': s.get('assignment_marks', 8),
            'behavior_score': s.get('behavior_score', 8)
        })['confidence'] for s in subjects) / len(subjects)
        
        # Determine risk level
        if predicted_sgpa >= 7.5:
            risk_level = 'SAFE'
        elif predicted_sgpa >= 6.0:
            risk_level = 'NEEDS_ATTENTION'
        else:
            risk_level = 'AT_RISK'
        
        return {
            'predicted_sgpa': round(predicted_sgpa, 2),
            'confidence': round(avg_confidence, 3),
            'risk_level': risk_level,
            'model_version': '1.0.0'
        }

def run_server():
    server = HTTPServer(('localhost', 8000), AIServiceHandler)
    print("AI Service running on http://localhost:8000")
    print("Health check: http://localhost:8000/health")
    server.serve_forever()

if __name__ == '__main__':
    run_server()
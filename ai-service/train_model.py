import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import numpy as np

# Training data
texts = [
    "Pothole on the main road", "Dangerous crack in the pavement", "Road damage near school",
    "Overflowing garbage bin", "Waste piling up in the park", "Trash on the street",
    "Water leak from pipe", "Major flooding in sector 62", "Sewage backup",
    "Street light is broken", "Lighting issue at night",
    "Robbery at gunpoint", "Theft in the market", "Unsafe area at night",
    "Noise complaint", "Tree fallen on road"
]
labels = [
    "ROAD", "ROAD", "ROAD",
    "GARBAGE", "GARBAGE", "GARBAGE",
    "WATER", "WATER", "WATER",
    "ROAD", "ROAD",
    "CRIME", "CRIME", "CRIME",
    "OTHER", "ROAD"
]

def train_and_save():
    # Ensure model directory exists
    os.makedirs("model", exist_ok=True)
    
    # Vectorize
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(texts)
    
    # Train
    model = LogisticRegression()
    model.fit(X, labels)
    
    # Save
    joblib.dump(model, "model/model.pkl")
    joblib.dump(vectorizer, "model/vectorizer.pkl")
    print("Model and Vectorizer saved to model/ directory!")

if __name__ == "__main__":
    train_and_save()

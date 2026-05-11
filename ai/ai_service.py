from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
import shutil
import os
import uuid

app = FastAPI()

UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
prototxt_path = os.path.join(BASE_DIR, "models", "deploy.prototxt")
model_path = os.path.join(BASE_DIR, "models", "res10_300x300_ssd_iter_140000.caffemodel")
print("PROTO:", prototxt_path, os.path.exists(prototxt_path))
print("MODEL:", model_path, os.path.exists(model_path))
net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)

@app.post("/embed")
async def generate_embedding(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.jpg")

    print("📥 Received:", file.filename)
    print("========== NEW REQUEST ==========")
    print("Filename:", file.filename)
    print("Content type:", file.content_type)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        image = cv2.imread(file_path)

        if image is None:
            return {"success": False, "message": "Image not readable"}

        (h, w) = image.shape[:2]

        blob = cv2.dnn.blobFromImage(
            cv2.resize(image, (300, 300)),
            1.0,
            (300, 300),
            (104.0, 177.0, 123.0)
        )

        net.setInput(blob)
        detections = net.forward()

        print("📊 Detections shape:", detections.shape)

        best_conf = 0
        best_box = None

        # 🔥 FIX: LOOP ALL DETECTIONS
        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            print("detected confidence:", confidence)
            if confidence > best_conf:
                    best_conf = confidence
                    box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                    (x1, y1, x2, y2) = box.astype("int")
                    best_box = (x1, y1, x2, y2)

        # ❌ NO FACE FOUND
        if best_conf < 0.2 or best_box is None:
            print("❌ No face detected. Best confidence:", best_conf)
            return {
                "success": False,
                "message": "No face found",
                "debug_confidence": float(best_conf)
            }

        x1, y1, x2, y2 = best_box

        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)

        face = image[y1:y2, x1:x2]

        if face.size == 0:
            return {"success": False, "message": "Face crop empty"}

        face = cv2.resize(face, (160, 160))

        embedding = face.flatten().astype("float32").tolist()

        return {
            "success": True,
            "vector": embedding,
            "confidence": float(best_conf)
        }

    except Exception as e:
        return {"success": False, "message": str(e)}

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
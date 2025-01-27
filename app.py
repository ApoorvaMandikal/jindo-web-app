from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("base")

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"
    try:
        # Save uploaded file
        with open(file_path, "wb") as f:
            content = await file.read()
            if not content:
                raise HTTPException(status_code=400, detail="Uploaded file is empty.")
            f.write(content)

        print(f"File saved at {file_path}")

        # Transcribe with Whisper
        result = model.transcribe(file_path)
        transcription = result["text"]
        print(f"Transcription: {transcription}")

        return {"transcription": transcription}

    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    finally:
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

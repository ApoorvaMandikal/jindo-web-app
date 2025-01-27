import whisper

def transcribe_audio(file_path):
    model = whisper.load_model("small")  # Use "tiny", "base", "small", "medium", or "large" as needed
    result = model.transcribe(file_path)
    return result["text"]

if __name__ == "__main__":
    import sys
    file_path = sys.argv[1]
    print(transcribe_audio(file_path))

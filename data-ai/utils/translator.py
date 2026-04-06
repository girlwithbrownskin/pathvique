import requests
import os

def translate_text(text: str, target_lang: str) -> str:
    if target_lang == "en":
        return text
    
    try:
        # LibreTranslate — completely free, no API key needed
        response = requests.post(
            "https://libretranslate.com/translate",
            json={
                "q": text,
                "source": "en",
                "target": target_lang,
                "format": "text"
            },
            timeout=10
        )
        result = response.json()
        return result.get("translatedText", text)
    except Exception:
        return text

SUPPORTED_LANGUAGES = {
    "en": "English",
    "ta": "Tamil",
    "hi": "Hindi"
}

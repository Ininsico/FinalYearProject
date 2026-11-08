import io
import os
import re

import pytesseract
from PIL import Image
from pypdf import PdfReader
from docx import Document

TESSERACT_CANDIDATES = [
    os.environ.get('TESSERACT_CMD', ''),
    r'C:\Program Files\Tesseract-OCR\tesseract.exe',
    '/usr/bin/tesseract',
    '/usr/local/bin/tesseract',
]
for candidate in TESSERACT_CANDIDATES:
    if candidate and os.path.exists(candidate):
        pytesseract.pytesseract.tesseract_cmd = candidate
        break

IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff', '.gif'}
TEXT_EXTENSIONS = {'.txt', '.md', '.csv'}
MAX_CHARS = 20000


class ExtractError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def _clean(text):
    text = '\n'.join(line.strip() for line in str(text or '').splitlines())
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text[:MAX_CHARS]


def extract(filename, data):
    """Read a PDF, image (OCR), DOCX or plain-text file and return its text."""
    name = os.path.basename(str(filename or 'upload'))
    stem, extension = os.path.splitext(name)
    extension = extension.lower()
    title = (stem or 'Uploaded source')[:120]

    if extension == '.pdf':
        try:
            reader = PdfReader(io.BytesIO(data))
        except Exception:
            raise ExtractError('Could not open that PDF — it may be corrupted')
        pages = [page.extract_text() or '' for page in reader.pages]
        text = _clean('\n\n'.join(pages))
        if not text:
            raise ExtractError(
                'No selectable text in this PDF (it looks scanned) — upload page images instead'
            )
        return {'title': title, 'text': text, 'kind': 'pdf', 'pages': len(reader.pages)}

    if extension in IMAGE_EXTENSIONS:
        try:
            image = Image.open(io.BytesIO(data))
            image.load()
        except Exception:
            raise ExtractError('Could not read that image file')
        text = _clean(pytesseract.image_to_string(image))
        if not text:
            raise ExtractError('No readable text found in the image — try a sharper capture')
        return {'title': title, 'text': text, 'kind': 'image'}

    if extension == '.docx':
        try:
            document = Document(io.BytesIO(data))
        except Exception:
            raise ExtractError('Could not open that DOCX file')
        text = _clean('\n'.join(paragraph.text for paragraph in document.paragraphs))
        if not text:
            raise ExtractError('That document appears to be empty')
        return {'title': title, 'text': text, 'kind': 'docx'}

    if extension in TEXT_EXTENSIONS or extension == '':
        try:
            decoded = data.decode('utf-8')
        except UnicodeDecodeError:
            decoded = data.decode('latin-1', 'replace')
        text = _clean(decoded)
        if not text:
            raise ExtractError('That file appears to be empty')
        return {'title': title, 'text': text, 'kind': 'text'}

    raise ExtractError(
        f'Unsupported file type "{extension or "unknown"}" — use PDF, PNG/JPG, DOCX, TXT or MD'
    )

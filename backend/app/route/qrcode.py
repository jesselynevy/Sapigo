from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.service.qr_service import generate_qr_image
import qrcode 
import io

router = APIRouter()

@router.get("/animals/{cow_id}/qrcode")
def generate_cow_qr(cow_id: str):
    qr_data = f"http://localhost:3000/animals/{cow_id}"

    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    return StreamingResponse(buf, media_type="image/png")
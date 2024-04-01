from fastapi import APIRouter, Depends

from src.models import User
from src.routers.auth.deps import current_user
from src.routers.auth.schemas import UserOut

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/me", response_model=UserOut, summary="Get user credentials")
async def handle_user_credential_send(user: User = Depends(current_user)):
    return user

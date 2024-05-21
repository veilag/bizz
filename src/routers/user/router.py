from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import current_user
from src.routers.auth.schemas import UserOut
from src.routers.user.service import share_access, get_user_by_name

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/me", response_model=UserOut, summary="Get user credentials")
async def handle_user_credential_send(user: User = Depends(current_user)):
    return user


@router.get("/share/permission/{username}")
async def handle_user_developer_access_share(
        username: str,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    if user.is_developer:
        share_user = await get_user_by_name(
            session=session,
            username=username
        )

        if not share_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователя с таким именем не существует"
            )

        await share_access(
            session=session,
            username=username
        )

        await session.commit()

        return {
            "message": "Успешно"
        }

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Вы не являетесь разработчиком"
    )

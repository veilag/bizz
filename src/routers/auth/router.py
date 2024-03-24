from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import current_user
from src.routers.auth.schemas import TokenSchema, UserOut, UserAuth
from src.routers.auth.service import get_user, add_user
from src.utils import verify_password, create_access_token, create_refresh_token

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/signup", response_model=UserOut, summary="Create new user")
async def handle_user_signup(
        data: UserAuth,
        session: AsyncSession = Depends(get_session)):

    user = await get_user(session, data.username)

    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this name already exists"
        )

    new_user = add_user(
        session=session,
        username=data.username,
        raw_password=data.password,
        email=data.email
    )

    await session.commit()
    return new_user


@router.post("/login", response_model=TokenSchema, summary="Login user")
async def handle_user_login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        session: AsyncSession = Depends(get_session)):

    user = await get_user(session, form_data.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    return {
        "access_token": create_access_token({
            "user_id": user.id
        }),

        "refresh_token": create_refresh_token({
            "user_id": user.id
        })
    }


@router.post("/me", response_model=UserOut, summary="Get user credentials")
async def handle_user_credential_send(user: User = Depends(current_user)):
    print(user.id)
    return user

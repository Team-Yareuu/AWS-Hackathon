from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from app.schemas.user import UserCreate, User, Token, TokenData
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.session import get_session
from app.config.settings import settings
from neo4j import AsyncSession
import uuid
from datetime import timedelta

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    result = await session.run("MATCH (u:User {email: $email}) RETURN u", email=token_data.email)
    user = await result.single()

    if user is None:
        raise credentials_exception
    return user['u']

@router.post("/register", response_model=User)
async def register(user: UserCreate, session: AsyncSession = Depends(get_session)):
    result = await session.run("MATCH (u:User {email: $email}) RETURN u", email=user.email)
    if await result.single():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    user_id = str(uuid.uuid4())

    await session.run("""
        CREATE (u:User {
            id: $id,
            email: $email,
            hashed_password: $hashed_password
        })
    """, id=user_id, email=user.email, hashed_password=hashed_password)

    return User(id=user_id, email=user.email)

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_session)):
    result = await session.run("MATCH (u:User {email: $email}) RETURN u", email=form_data.username)
    user = await result.single()

    if not user or not verify_password(form_data.password, user['u']['hashed_password']):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/me/saved-recipes")
async def save_recipe(recipe_id: str, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    await session.run("""
        MATCH (u:User {id: $user_id}), (r:Recipe {id: $recipe_id})
        MERGE (u)-[:SAVED]->(r)
    """, user_id=current_user.id, recipe_id=recipe_id)
    return {"message": "Recipe saved successfully"}

@router.get("/me/saved-recipes")
async def get_saved_recipes(current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await session.run("""
        MATCH (u:User {id: $user_id})-[:SAVED]->(r:Recipe)
        RETURN r
    """, user_id=current_user.id)
    recipes = await result.values()
    return recipes
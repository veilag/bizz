import json
from typing import Dict, Any

from langchain_core.messages import HumanMessage
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from langchain.chat_models.gigachat import GigaChat

from src.config import cfg
from src.models import BusinessPlanItems, BusinessQuery
import src.service.prompts as prompts

# query_id: int, query: str, description: str

class AIGenerator:
    generation_prompt = ""

    async def generate_business_credentials(self,
                                            session: AsyncSession,
                                            data: Dict[str, Any]):
        await self.generate_business_plan(
            data=data,
            session=session
        )

    async def generate_business_plan(self, data: Dict[str, Any], session: AsyncSession) -> None:
        business_query = await session.execute(
            select(BusinessQuery)
            .where(BusinessQuery.id == data["query_id"])
        )
        query = business_query.scalars().one()

        chat = GigaChat(
            credentials=cfg.ai_key,
            verify_ssl_certs=False
        )

        messages = [
            HumanMessage(
                content=prompts.PLAN_GENERATION.format(
                    query=query.query,
                    description=query.description,
                    city=query.city
                )
            )
        ]

        business_plan_response = chat(messages)
        business_plan = json.loads(business_plan_response.content)

        for plan_item in business_plan:
            session.add(
                BusinessPlanItems(
                    name=plan_item["name"],
                    description=plan_item["description"],
                    query_id=data["query_id"]
                )
            )

        await session.commit()

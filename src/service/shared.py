from langchain.schema import HumanMessage, SystemMessage
from uuid import uuid4
from json import loads, dumps
import base64
from aiogram import Dispatcher, Bot, Router
from aiogram.types import Message, CallbackQuery
import requests

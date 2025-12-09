from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import lightning.pytorch as L
import torch
import numpy as np
import pandas as pd
from Model import Model
import joblib

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class carInfo(BaseModel):
    manufacturer: str
    model: str
    odometer: int
    year: int
    engine_displacement: float
    transmission: str
    colour: str
    engine_fuel: str
    body: str
    has_warranty: bool
    drivetrain: str
    is_exchangeable: bool

#load model checkpoint
loaded_model = Model.load_from_checkpoint("checkpoints/model(epoch=99,loss=0.0000)-v2.ckpt")
loaded_model.eval()

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "message": "Hello, World!"})

@app.post("/predict")
def predict_price(data:carInfo):
    print(f"data: {data}; manufacturer: {data.manufacturer}")

    #encoding issues preventing model from calculating predicted price

    return {"message": "Response from server"}

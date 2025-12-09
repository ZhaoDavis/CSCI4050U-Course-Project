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

    data_arr = {"manufacturer_name": data.manufacturer, "model_name": data.model, "transmission": data.transmission, 
                "color": data.colour, "odometer_value": data.odometer, "year_produced": data.year, "engine_fuel": data.engine_fuel, 
                "engine_capacity": data.engine_displacement, "body_type": data.body, "drivetrain": data.drivetrain,
                "has_warranty": data.has_warranty, "price_usd": 6642, "is_exchangeable": data.is_exchangeable}

    #col-39
    encoding_dict = {
        "manufacturer_name": 0,
        "model_name": 0,
        "odometer_value": 0,
        "year_produced": 0,
        "engine_capacity": 0,
        "transmission_mechanical": 0,#
        "color_blue": 0,#
        "color_brown": 0,#
        "color_green": 0,#
        "color_grey": 0,#
        "color_orange": 0,#
        "color_other": 0,#
        "color_red": 0,#
        "color_silver": 0,#
        "color_violet": 0,#
        "color_white": 0,#
        "color_yellow": 0,#
        "engine_fuel_electric": 0,#
        "engine_fuel_gas": 0,#
        "engine_fuel_gasoline": 0,#
        "engine_fuel_hybrid-diesel": 0,#
        "engine_fuel_hybrid-petrol": 0,#
        "body_type_coupe": 0,#
        "body_type_hatchback": 0,#
        "body_type_liftback": 0,#
        "body_type_limousine": 0,#
        "body_type_minibus": 0,#
        "body_type_minivan": 0,#
        "body_type_pickup": 0,#
        "body_type_sedan": 0,#
        "body_type_suv": 0,#
        "body_type_universal": 0,#
        "body_type_van": 0,#
        "has_warranty": 0,#
        "drivetrain_front": 0,#
        "drivetrain_rear": 0,#
        "is_exchangeable": 0 #37
    }

    #true=1 false = 0
    if(data.has_warranty == True):
        encoding_dict["has_warranty"] = 1
    if(data.is_exchangeable == True):
        encoding_dict["is_exchangeable"] = 1
    if(data.transmission == "mechanical"):
        encoding_dict["transmission_mechanical"] = 1
    if(data.drivetrain == "front"):
        encoding_dict["drivetrain_front"] = 1
    if(data.drivetrain == "rear"):
        encoding_dict["drivetrain_rear"] = 1

    encode_colour = "color_" + data.colour
    encode_fuel = "engine_fuel_" + data.engine_fuel
    encode_body = "body_type_" + data.body

    encoding_dict[encode_colour] = 1
    encoding_dict[encode_fuel] = 1
    encoding_dict[encode_body] = 1

#manf_name, model_name to encoder
#mand_name, model_name, odometer, year, engine_capacity to scaler
    loaded_encoder = joblib.load("target_encoder.joblib")
    loaded_scaler = joblib.load("standard_scaler.joblib")

    to_encode = data_arr
    to_encode_2d = pd.DataFrame({k: [v] for k, v in to_encode.items()})
    print(f"DATA ARRAY: {to_encode}")
    encoded = loaded_encoder.transform(to_encode_2d)

    #to_scale.append(data.odometer)
    #to_scale.append(data.year)
    #to_scale.append(data.engine_displacement)

    keys = ["manufacturer_name", "model_name", "transmission", "color", "odometer_value", "year_produced", "engine_fuel", "engine_capacity", "body_type", "drivetrain","has_warranty", "price_usd", "is_exchangeable"]

    encoded_and_scaled = dict(zip(keys, encoded.iloc[0].tolist()))

    #encoded_and_scaled = loaded_scaler.transform(to_scale_2d)
    #encoded_and_scaled.flatten()

    #encoding_dict["manufacturer_name"] = encoded_and_scaled[0]
    #encoding_dict["model_name"] = encoded_and_scaled[1]
    #encoding_dict["odometer_value"] = encoded_and_scaled[2]
    #encoding_dict["year_produced"] = encoded_and_scaled[3]
    #encoding_dict["engine_capacity"] = encoded_and_scaled[4]


    x = pd.DataFrame({k: [v] for k, v in encoding_dict.items()})
    x = x.values.astype(np.float32)

    input_tensor = torch.from_numpy(encoded)

    with torch.no_grad():
        y_pred = loaded_model(input_tensor)

    return {"message": y_pred}

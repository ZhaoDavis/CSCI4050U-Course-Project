#!/usr/bin/env python
# coding: utf-8

# In[178]:


import pandas as pd
import numpy as np
import torch
from torch.utils.data import TensorDataset, DataLoader
import lightning as L   
from torch import nn   
from torch import optim  

#dataset obtained from https://www.kaggle.com/datasets/lepchenkov/usedcarscatalog
df = pd.read_csv('cars.csv')

df = df.drop(columns=["engine_type", "engine_has_gas", "state", "location_region", 
                      "number_of_photos", "up_counter", "feature_0", "feature_1", 
                      "feature_2", "feature_3", "feature_4", "feature_5", 
                      "feature_6", "feature_7", "feature_8", "feature_9", 
                      "duration_listed"])

#len(df.loc[df['manufacturer_name'] == 'Fiat'])
#models_by_manf = df.groupby("manufacturer_name")["model_name"].unique()
#models_df = models_by_manf.reset_index()
#models_df = models_df.sort_values(by="manufacturer_name")
#models_df['model_name'] = models_df["model_name"].apply(sorted)
#models_df.to_csv("car_models.csv", index=False)


# In[179]:


import category_encoders as ce
from sklearn.preprocessing import StandardScaler
import joblib

#encode manufacturer and model to the mean of the sell price of each category
encoder = ce.TargetEncoder(cols=["manufacturer_name", "model_name"])

df = encoder.fit_transform(df, df["price_usd"])

joblib.dump(encoder, "target_encoder.joblib")

#one-hot encoding for the following columns:
df_encoded = pd.get_dummies(df, columns=["transmission", "color", "engine_fuel", "body_type", "has_warranty", "drivetrain", "is_exchangeable"], drop_first=True)

#rename two columns
df_encoded = df_encoded.rename(columns={"has_warranty_True": "has_warranty", "is_exchangeable_True": "is_exchangeable"})

tf_columns = ["has_warranty", "is_exchangeable", "transmission_mechanical", "color_blue", 
              "color_brown", "color_green", "color_grey", "color_orange", "color_other", 
              "color_red", "color_silver", "color_violet", "color_white", "color_yellow", 
              "engine_fuel_electric", "engine_fuel_gas", "engine_fuel_gasoline", 
              "engine_fuel_hybrid-diesel", "engine_fuel_hybrid-petrol", "body_type_coupe", 
              "body_type_hatchback", "body_type_liftback", "body_type_limousine", 
              "body_type_minibus", "body_type_minivan", "body_type_pickup", "body_type_sedan", 
              "body_type_suv", "body_type_universal", "body_type_van", "drivetrain_front", 
              "drivetrain_rear"]

#convert True/False to 0 or 1 in one-hot encoded columns
df_encoded[tf_columns] = df_encoded[tf_columns].replace({True: 1, False: 0})

#scale features
columns_for_scaling = ["manufacturer_name", "model_name", "odometer_value", "year_produced", "engine_capacity"]
scaler = StandardScaler()
df_encoded[columns_for_scaling] = scaler.fit_transform(df_encoded[columns_for_scaling])

#scale targets
df_encoded["price_usd"] = np.log(df_encoded["price_usd"])

pd.set_option("display.max_columns", None)
#columns = [f"{col}" for col in df_encoded.columns]
#print(columns)

df_encoded


# In[180]:


class Model(L.LightningModule):
    def __init__(self):
        super().__init__()
        self.nn = nn.Sequential(
            nn.Linear(37, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64,1)
        )
        self.loss_fn = nn.L1Loss()
        self.loss_fn = nn.SmoothL1Loss()

    def forward(self, batch):
        x = self.nn(batch)
        return x
    
    def training_step(self, batch):
        x, y = batch
        y_pred = self.forward(x)
        loss = self.loss_fn(y_pred, y)
        return loss
    
    def configure_optimizers(self):
        optimizer = optim.Adam(self.parameters(), lr=0.004)
        return optimizer


# In[181]:


#pd.set_option("display.max_columns", None)
#clean data for any rows with NaN values
df_encoded_cleaned = df_encoded.dropna(axis=0, how="any", inplace=True)

#get samples for training and testing
df_train = df_encoded.sample(n=35000, random_state=10)

df_test = df_encoded.drop(df_train.index).sample(n=3000, random_state=10)

df_train.to_csv("TRAIN.csv")

features = ['manufacturer_name', 'model_name', 'odometer_value', 'year_produced', 
            'engine_capacity', 'transmission_mechanical', 'color_blue', 'color_brown', 
            'color_green', 'color_grey', 'color_orange', 'color_other', 'color_red', 
            'color_silver', 'color_violet', 'color_white', 'color_yellow', 
            'engine_fuel_electric', 'engine_fuel_gas', 'engine_fuel_gasoline', 
            'engine_fuel_hybrid-diesel', 'engine_fuel_hybrid-petrol', 'body_type_coupe', 
            'body_type_hatchback', 'body_type_liftback', 'body_type_limousine', 
            'body_type_minibus', 'body_type_minivan', 'body_type_pickup', 'body_type_sedan', 
            'body_type_suv', 'body_type_universal', 'body_type_van', 'has_warranty', 
            'drivetrain_front', 'drivetrain_rear', 'is_exchangeable']

targets = ["price_usd"]


# In[182]:


#set up training dataloader
training_targets = torch.tensor(
    df_train[targets].values,
    dtype=torch.float32
)

training_inputs = torch.tensor(
    df_train[features].values,
    dtype=torch.float32
)

training_dataset = TensorDataset(training_inputs, training_targets)
training_dataloader = DataLoader(training_dataset, shuffle=True, batch_size=100)

batch = next(iter(training_dataloader))


# In[183]:


#set up testing dataloader
testing_targets = torch.tensor(
    df_test[targets].values,
    dtype=torch.float32
)

testing_inputs = torch.tensor(
    df_test[features].values,
    dtype=torch.float32
)

#testing_targets = targets.view(-1, 1)

testing_dataset = TensorDataset(testing_inputs, testing_targets)
testing_dataloader = DataLoader(testing_dataset, shuffle=True, batch_size=100)

batch = next(iter(testing_dataloader))


# In[184]:


from lightning.pytorch.callbacks import ModelCheckpoint
model = Model()

#save checkpoint if loss is lower than previous lowest loss epoch
#checkpoint_callback = ModelCheckpoint(dirpath="checkpoints", filename="model({epoch},{loss:.4f})", save_top_k = 1)

#commented out to stop training on server startup
#trainer = L.Trainer(max_epochs=100, callbacks=[checkpoint_callback])
#trainer.fit(model, training_dataloader)


# In[185]:


from sklearn.metrics import mean_absolute_error

def evaluate_model(model, test_dataloader):

    model.eval() #set model to eval mode
    full_y_pred = []
    full_y_true = []

    torch.no_grad()
    for x_batch, y_batch in test_dataloader:
        #get predictions from model, still log transformed
        y_pred = model(x_batch).squeeze() 
        
        y_pred = y_pred.detach().numpy()
        y_correct = y_batch.detach().squeeze().numpy()
        
        #covnert predictions back to dollars
        y_pred_dollars = np.exp(y_pred)
        y_true_dollars = np.exp(y_correct)
        
        full_y_pred.extend(y_pred_dollars)
        full_y_true.extend(y_true_dollars)

    torch.enable_grad()
    
    mean_price = np.mean(full_y_true)
    mae = mean_absolute_error(full_y_true, full_y_pred)

    print(f"mean absolute error: {mae}\nmean car price: {mean_price}\nrows processed: {len(test_dataloader.dataset)}")

#load model from saved checkpoint
checkpoint_path = "checkpoints/model(epoch=99,loss=0.0000)-v2.ckpt"

checkpoint_model = Model.load_from_checkpoint(checkpoint_path)
checkpoint_model.eval()

#evaluate_model(model, training_dataloader)

evaluate_model(checkpoint_model, training_dataloader)


# In[ ]:





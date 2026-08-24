import torch

from model import model


dummy_image = torch.rand(1, 1, 28, 28)

with torch.no_grad():
    outputs = model(dummy_image)

prediction = outputs.argmax(dim=1).item()

print("Output shape:", outputs.shape)
print("Prediction:", prediction)
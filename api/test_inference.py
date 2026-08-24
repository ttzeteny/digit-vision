from io import BytesIO

import torchvision
from PIL import Image

from model import load_model
from preprocessing import preprocess_image

import torch

dataset = torchvision.datasets.MNIST(
    root="data/raw",
    train=False,
    download=True,
    transform=None,
)

image, label = dataset[0]

buffer = BytesIO()
image.save(buffer, format="PNG")

image_bytes = buffer.getvalue()

input_tensor = preprocess_image(image_bytes)

model = load_model()

with torch.no_grad():
    outputs = model(input_tensor)

prediction = outputs.argmax(dim=1).item()

print(f"Actual label: {label}")
print(f"Predicted label: {prediction}")

probabilities = torch.softmax(outputs, dim=1)

confidence = probabilities[0, prediction].item()

print(f"Confidence: {confidence:.4%}")
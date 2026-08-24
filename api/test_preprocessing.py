from io import BytesIO

import torchvision
from PIL import Image

from preprocessing import preprocess_image


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

tensor = preprocess_image(image_bytes)

print("Label:", label)
print("Tensor shape:", tensor.shape)
print("Minimum:", tensor.min().item())
print("Maximum:", tensor.max().item())
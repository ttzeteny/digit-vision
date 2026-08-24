from io import BytesIO

import torch
from PIL import Image
from torchvision import transforms

transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((28, 28)),
    transforms.ToTensor(),
    transforms.Lambda(lambda x: 1.0 - x)
])

def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    image = Image.open(BytesIO(image_bytes))

    image = transform(image)

    image = image.unsqueeze(0)

    return image
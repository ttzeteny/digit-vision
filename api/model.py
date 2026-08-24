import json
from pathlib import Path

import torch
import torch.nn as nn


class CNNModel(nn.Module):
    def __init__(
        self,
        conv1_channels: int,
        conv2_channels: int,
        dropout: float,
        num_classes: int = 10,
    ):
        super().__init__()

        self.features = nn.Sequential(
            nn.Conv2d(
                1,
                conv1_channels,
                kernel_size=3,
                padding=1,
            ),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(
                conv1_channels,
                conv2_channels,
                kernel_size=3,
                padding=1,
            ),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )

        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(dropout),
            nn.Linear(
                conv2_channels * 7 * 7,
                num_classes,
            ),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        return self.classifier(x)


def load_model() -> CNNModel:
    model_dir = Path(__file__).resolve().parent.parent / "models"

    with open(model_dir / "model_config.json", "r") as f:
        config = json.load(f)

    model = CNNModel(
        conv1_channels=config["conv1_channels"],
        conv2_channels=config["conv2_channels"],
        dropout=config["dropout"],
        num_classes=config["num_classes"],
    )

    model.load_state_dict(
        torch.load(
            model_dir / "cnn_mnist.pt",
            map_location="cpu",
            weights_only=True,
        )
    )

    model.eval()

    return model
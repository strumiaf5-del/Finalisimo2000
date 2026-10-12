import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from preview_contracts import PreviewParams


def test_preview_params_contains_full_mastering_surface():
    fields = set(PreviewParams.model_fields)

    required = {
        "input_gain_db",
        "target_peak",
        "oversample_mode",
        "comp_threshold_db",
        "comp_ratio",
        "limiter_ceiling",
        "saturation_drive",
        "mb_low_threshold_db",
        "mb_mid_threshold_db",
        "mb_high_threshold_db",
        "preview_start_sec",
        "output_format",
        "output_bit_depth",
        "loudness_target",
    }

    missing = sorted(required - fields)
    assert not missing, f"PreviewParams missing expected fields: {missing}"
    assert len(fields) >= 150, f"PreviewParams unexpectedly truncated: {len(fields)} fields"


def test_preview_params_accepts_full_payload_shape():
    payload = {
        "input_gain_db": 0.5,
        "target_peak": 0.95,
        "use_lufs_normalize": False,
        "loudness_target": -14.0,
        "comp_threshold_db": -18.0,
        "comp_ratio": 4.0,
        "mb_low_threshold_db": -16.0,
        "mb_mid_threshold_db": -18.0,
        "mb_high_threshold_db": -20.0,
        "saturation_drive": 2.0,
        "preview_start_sec": 30.0,
        "output_format": "wav",
        "output_bit_depth": 16,
    }

    model = PreviewParams(**payload)
    assert model.input_gain_db == 0.5
    assert model.preview_start_sec == 30.0
    assert model.output_bit_depth == 16

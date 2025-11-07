#!/usr/bin/env python3

import shutil
import os
import json

used, free = shutil.disk_usage("/")

data = {
    "used_gb": round(used / (1024 ** 3), 2),
    "free_gb": round(free / (1024 ** 3), 2)
}

output_path = os.path.join(os.path.dirname(__file__), "disk.json")

with open(output_path, "w") as f:
    json.dump(data, f)
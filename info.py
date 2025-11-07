#!/usr/bin/env python3

import shutil
import datetime
import subprocess
import json

total, used, free = shutil.disk_usage("/")
last_updated = datetime.datetime.now(datetime.timezone.utc).isoformat()

try:
    boot_time_str = subprocess.check_output(["uptime", "-s"], text=True).strip()
    boot_time = datetime.datetime.fromisoformat(boot_time_str).astimezone(datetime.timezone.utc).isoformat()
except Exception:
    boot_time = last_updated

data = {
    "used_gb": round(used / (1024**3), 2),
    "free_gb": round(free / (1024**3), 2),
    "last_updated": last_updated,
    "boot_time": boot_time
}

output_path = "/var/www/html/info.json"

with open(output_path, "w") as f:
    json.dump(data, f)
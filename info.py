#!/usr/bin/env python3

import shutil
import datetime
import subprocess
import json

total, used, free = shutil.disk_usage('/')
last_updated = datetime.datetime.now(datetime.timezone.utc).isoformat()

try:
    boot_time_str = subprocess.check_output(["uptime", "-s"], text=True).strip()
    boot_time = datetime.datetime.fromisoformat(boot_time_str).astimezone(datetime.timezone.utc).isoformat()
except Exception:
    boot_time = last_updated

try:
    last_commit_message = subprocess.check_output(["git", "log", "-1", "--pretty=%B"], text=True).strip()
except subprocess.CalledProcessError:
    last_commit_message = "no commit message"
except FileNotFoundError:
    last_commit_message = "git not installed or not in repo"

data = {
    "used_gb": round(used / (1024 ** 3), 2),
    "total_gb": round(total / (1024 ** 3), 2),
    "last_updated": f"{boot_time}: {last_commit_message}",
    "boot_time": boot_time,
    "free_gb": round(free / (1024 ** 3), 2)
}

output_path = "/var/www/html/info.json"

with open(output_path, 'w') as f:
    json.dump(data, f)
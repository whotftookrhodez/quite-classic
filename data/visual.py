data = {
    "industrial_mess": {
        "image": "",
        "title": "AfterTrasen - Industrial mess",
    },
    "feelings_21": {
        "image": "",
        "title": "r - feelings 21"
    },
    "untitled_oc_art": {
        "image": "",
        "title": "sea shore - untitled oc art"
    }
}

for _, item in data.items():
    prefix = item["title"].split(' - ', 1)[1]

    if item.get("type") == "video":
        item["cover"] = f"/assets/visual/{prefix} cover.png"
        item["video"] = f"/assets/visual/{prefix}.mp4"
    else:
        item["image"] = f"/assets/visual/{prefix}.png"
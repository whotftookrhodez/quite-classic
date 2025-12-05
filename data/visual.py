data = {
    "1125_mg_trazodone_1": {
        "image": "",
        "title": "r - 1125 mg trazodone 1",
    },
    "1125_mg_trazodone_2": {
        "image": "",
        "title": "r - 1125 mg trazodone 2",
    },
    "1125_mg_trazodone_3": {
        "image": "",
        "title": "r - 1125 mg trazodone 3",
    },
    "1125_mg_trazodone_4": {
        "image": "",
        "title": "r - 1125 mg trazodone 4",
    },
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
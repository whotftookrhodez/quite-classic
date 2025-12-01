data = {
    "timelapse": {
        "title": "r - timelapse",
        "cover": "",
        "tracks": [
            {
                "mp3": "/assets/audio/stream/timelapse.mp3",
                "flac": "/assets/audio/download/timelapse.flac"
            }
        ]
    },
    "it_doesnt_matter": {
        "title": "AfterTrasen - It doesn't matter",
        "cover": "",
        "tracks": [
            {
                "mp3": "/assets/audio/stream/It doesn't matter.mp3",
                "flac": "/assets/audio/download/It doesn't matter.flac"
            }
        ]
    },
    "city_square_trance_2009": {
        "title": "r - city square trance 2009",
        "cover": "",
        "tracks": [
            {
                "mp3": "/assets/audio/stream/city square trance 2009.mp3",
                "flac": "/assets/audio/download/city square trance 2009.flac"
            }
        ]
    },
    "this_project_does_not_exist": {
        "title": "AfterTrasen - This_project_does_not_exist",
        "cover": "",
        "tracks": [
            {
                "mp3": "/assets/audio/stream/This_project_does_not_exist.mp3",
                "flac": "/assets/audio/download/This_project_does_not_exist.flac"
            }
        ]
    },
    "night_drive_in_da_celica": {
        "title": "AfterTrasen - Night_drive_in_da_celica",
        "cover": "",
        "tracks": [
            {
                "mp3": "/assets/audio/stream/Night_drive_in_da_celica.mp3",
                "flac": "/assets/audio/download/Night_drive_in_da_celica.flac"
            }
        ]
    },
    "assembling-machine-t3-1": {
        "title": "AfterTrasen - assembling-machine-t3-1",
        "cover": "",
        "tracks": [
            {
                "mp3": "/assets/audio/stream/assembling-machine-t3-1.mp3",
                "flac": "/assets/audio/download/assembling-machine-t3-1.flac"
            }
        ]
    },
    "untitled_techno_demo": {
        "title": "AfterTrasen - Untitled Techno Demo",
        "cover": "",
        "tracks": [
            {
                "mp3": "/assets/audio/stream/Untitled Techno Demo.mp3",
                "flac": "/assets/audio/download/Untitled Techno Demo.flac"
            }
        ]
    }
}

for _, item in data.items():
    prefix = item["title"].split(' - ', 1)[1]
    item["cover"] = f"/assets/audio/download/{prefix} cover.png"
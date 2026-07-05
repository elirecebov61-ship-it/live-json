import sys
import json
import random

def live_odds(team1, team2):
    base_home = random.uniform(1.2, 3.5)
    base_away = random.uniform(1.2, 3.5)
    draw = 1 / (1 / base_home + 1 / base_away)
    vig = 0.1
    return {
        "home": round(base_home / (1 + vig), 2),
        "away": round(base_away / (1 + vig), 2),
        "draw": round(draw / (1 + vig), 2),
        "updatedAt": "2026-07-05T00:00:00Z"
    }

if __name__ == "__main__":
    print(json.dumps(live_odds(sys.argv[1], sys.argv[2])))

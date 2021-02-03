import asyncio
import websockets
import json
from pprint import pprint

'''
JOIN -> join
DATA -> data
NLOC -> new location
NPLR -> new player
NCRD -> new coordinates
'''

players = {}
USERS = set()


async def connect(websocket, path):
    USERS.add(websocket)
    local_username = None
    async for message in websocket:
        category = message[:4]
        data = message[4:]

        if category == "JOIN":
            player = json.loads(data)
            local_username = player["username"]

            await websocket.send("DATA" + json.dumps(players))  # send the user all the player data
            players[player["username"]] = player

            await asyncio.wait([user.send("NPLR" + data) for user in USERS])  # send all players the new user

        elif category == "NLOC":
            player = json.loads(data)
            players[player["username"]]["x"] = int(player["x"])
            players[player["username"]]["y"] = int(player["y"])

            await asyncio.wait([user.send("NCRD" + data) for user in USERS])  # send everyone these new coords

    USERS.remove(websocket)
    del players[local_username]


start_server = websockets.serve(connect, "localhost", 1345)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

from functools import reduce
from Json import newAnimalActivityLogDetails, newAnimalActivityDetails
from Annotations import UseAPI, getApi, login_as_marry, login_as_junior_keeper
from time import time

from datetime import datetime
def debug_map(arr):
    return list(
        sorted(
            map(lambda a: datetime.fromtimestamp(a["eventStartDateTime"]/1000), arr),
            key = lambda a: a
        ))

# Animal Activity API
@login_as_marry
def createAnimalActivity(mockData, useAPI: UseAPI):
    res = useAPI.post("/api/animal/createAnimalActivity", 
                      json=mockData)
    response_json = res.json()
    assert "animalActivity" in response_json, "No animalActivity! " + ("" if "error" not in response_json else response_json["error"])
    assert response_json["animalActivity"]["details"] == mockData["details"], "Data does not match"
    mockData["animalActivityId"] = response_json["animalActivity"]["animalActivityId"]

@login_as_marry
def getAnimalActivityById(mockData, useAPI: UseAPI):
    res = useAPI.get("/api/animal/getAnimalActivityById/{}".format(mockData["animalActivityId"]))
    response_json = res.json()
    assert "animalActivity" in response_json, "No animalActivity! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["animalActivity"]["details"] == mockData["details"])
    assert len(response_json["animalActivity"]["zooEvents"]) in [4,5], "Zoo events incorrectly created " + str(len(response_json["animalActivity"]["zooEvents"])) + " found!"

@login_as_marry
def updateAnimalActivity(mockData, useAPI: UseAPI):
    mockData["details"] = "New activity details!"
    mockData["endDate"] = time() * 1000 + 1000 * 60 * 60 * 24 * 60
    res = useAPI.put("/api/animal/updateAnimalActivity", json=mockData)
    response_json = res.json()
    assert "updatedAnimalActivity" in response_json, "No updatedAnimalActivity! " + ("" if "error" not in response_json else response_json["error"])
    assert response_json["updatedAnimalActivity"]["details"] == mockData["details"], "Details do not match!"
    assert len(response_json["updatedAnimalActivity"]["zooEvents"]) in [8,9], "Zoo events incorrectly created " + str(len(response_json["updatedAnimalActivity"]["zooEvents"])) + " found!"
    
    mockData["startDate"] = time() * 1000 - 1000 * 60 * 60 * 24 * 30
    mockData["endDate"] = time() * 1000 + 1000 * 60 * 60 * 24 * 30
    res = useAPI.put("/api/animal/updateAnimalActivity", json=mockData)
    response_json = res.json()
    assert "updatedAnimalActivity" in response_json, "No updatedAnimalActivity! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["updatedAnimalActivity"]["details"] == mockData["details"])
    assert len(response_json["updatedAnimalActivity"]["zooEvents"]) in [4,5], "Zoo events incorrectly created " + str(len(response_json["updatedAnimalActivity"]["zooEvents"])) + " found!"

    mockData["startDate"] = time() * 1000 + 1000 * 60 * 60 * 24 * 30
    mockData["endDate"] = time() * 1000 + 1000 * 60 * 60 * 24 * 60
    res = useAPI.put("/api/animal/updateAnimalActivity", json=mockData)
    response_json = res.json()
    print("c",debug_map(response_json["updatedAnimalActivity"]["zooEvents"]))
    assert "updatedAnimalActivity" in response_json, "No updatedAnimalActivity! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["updatedAnimalActivity"]["details"] == mockData["details"])
    assert len(response_json["updatedAnimalActivity"]["zooEvents"]) in [4,5], "Zoo events incorrectly created " + str(len(response_json["updatedAnimalActivity"]["zooEvents"])) + " found!"

    mockData["recurringPattern"] = "NON_RECURRING"
    mockData["startDate"] = round(time()  +  60 * 60 * 24 * 10) * 1000
    mockData["endDate"] = mockData["startDate"]
    res = useAPI.put("/api/animal/updateAnimalActivity", json=mockData)
    response_json = res.json()
    assert "updatedAnimalActivity" in response_json, "No updatedAnimalActivity! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["updatedAnimalActivity"]["recurringPattern"] == mockData["recurringPattern"])
    assert(response_json["updatedAnimalActivity"]["endDate"] == mockData["endDate"])
    assert(response_json["updatedAnimalActivity"]["startDate"] == mockData["startDate"])
    assert len(response_json["updatedAnimalActivity"]["zooEvents"]) == 1, "Zoo events incorrectly created " + str(len(response_json["updatedAnimalActivity"]["zooEvents"])) + " found!"
    
@login_as_marry
def deleteAnimalActivity(mockData, useAPI: UseAPI):
    res = useAPI.delete("/api/animal/deleteAnimalActivity/{}".format(mockData["animalActivityId"]),
                     mockData)
    response_json = res.json()
    assert "result" in response_json, "No success message!"
    assert(response_json["result"] == "success")

    res = useAPI.get("/api/animal/getAnimalActivityById/{}".format(mockData["animalActivityId"]))
    response_json = res.json()
    assert("error" in response_json)

ANIMAL_ACTIVITY_API_TESTS = [
    (createAnimalActivity, newAnimalActivityDetails), 
    (getAnimalActivityById, newAnimalActivityDetails),
    (updateAnimalActivity, newAnimalActivityDetails),
    (deleteAnimalActivity, newAnimalActivityDetails)
]

# Animal Activity Log API 
@login_as_marry
def createAnimalActivityLog(mockData, useAPI: UseAPI):
    res = useAPI.post("/api/animal/createAnimalActivityLog", 
                      json=mockData)
    response_json = res.json()
    assert "animalActivityLog" in response_json, "No animalActivityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["animalActivityLog"]["details"] == mockData["details"])
    mockData["animalActivityLogId"] = response_json["animalActivityLog"]["animalActivityLogId"]

@login_as_marry
def getAnimalActivityLogById(mockData, useAPI: UseAPI):
    res = useAPI.get("/api/animal/getAnimalActivityLogById/{}".format(mockData["animalActivityLogId"]))
    response_json = res.json()
    assert "animalActivityLog" in response_json, "No animalActivityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["animalActivityLog"]["details"] == mockData["details"])

@login_as_marry
def getAnimalActivityLogsByAnimalCode(animalCode, mockData, useAPI: UseAPI):
    res = useAPI.get("/api/animal/getAnimalActivityLogsByAnimalCode/{}".format(animalCode))
    response_json = res.json()
    assert "animalActivityLogs" in response_json, "No animalActivityLogs! " + ("" if "error" not in response_json else response_json["error"])
    assert(
        1 == len(list(filter(lambda log: log["animalActivityLogId"] == mockData["animalActivityLogId"], 
                        response_json["animalActivityLogs"])))
           )

@login_as_marry
def updateAnimalActivityLog(mockData, useAPI: UseAPI):
    mockData["details"] = "I HAVE UPDATED MY DETAILS!"
    res = useAPI.put("/api/animal/updateAnimalActivityLog/{}".format(mockData["animalActivityLogId"]),
                     mockData)
    response_json = res.json()
    assert "animalActivityLog" in response_json, "No animalActivityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["animalActivityLog"]["details"] == mockData["details"])

@login_as_marry
def deleteAnimalActivityLogById(mockData, useAPI: UseAPI):
    res = useAPI.delete("/api/animal/deleteAnimalActivityLogById/{}".format(mockData["animalActivityLogId"]),
                     mockData)
    response_json = res.json()
    assert "result" in response_json, "No success message!"
    assert(response_json["result"] == "success")

    res = useAPI.get("/api/animal/getAnimalActivityLogById/{}".format(mockData["animalActivityLogId"]))
    response_json = res.json()
    assert("error" in response_json)

ANIMAL_ACTIVITY_LOG_API_TESTS = [
    (createAnimalActivityLog, newAnimalActivityLogDetails), 
    (getAnimalActivityLogById, newAnimalActivityLogDetails), 
    (getAnimalActivityLogsByAnimalCode, "ANM00001", newAnimalActivityLogDetails), 
    (updateAnimalActivityLog, newAnimalActivityLogDetails),
    (deleteAnimalActivityLogById, newAnimalActivityLogDetails)
]


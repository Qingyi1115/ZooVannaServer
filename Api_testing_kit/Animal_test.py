from Json import newAnimalActivityLogDetails
from Annotations import UseAPI, getApi, login_as_marry, login_as_junior_keeper

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

@login_as_marry
def getAnimalActivityById(mockData, useAPI: UseAPI):
    res = useAPI.get("/api/animal/getAnimalActivityById/{}".format(mockData["animalActivityId"]))
    response_json = res.json()
    assert "animalActivity" in response_json, "No animalActivity! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["animalActivity"]["details"] == mockData["details"])

@login_as_marry
def updateAnimalActivity(mockData, useAPI: UseAPI):
    res = useAPI.put("/api/animal/updateAnimalActivity", json=mockData)
    response_json = res.json()
    assert "updatedAnimalActivity" in response_json, "No updatedAnimalActivity! " + ("" if "error" not in response_json else response_json["error"])
    assert(response_json["updatedAnimalActivity"]["details"] == mockData["details"])

ANIMAL_ACTIVITY_API_TESTS = [
    (createAnimalActivity, newAnimalActivityLogDetails), 
    (getAnimalActivityById, newAnimalActivityLogDetails),
    (updateAnimalActivity, newAnimalActivityLogDetails),
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


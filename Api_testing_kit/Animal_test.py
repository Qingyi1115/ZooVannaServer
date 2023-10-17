from Annotations import UseAPI
from Json import newAnimalActivityLogDetails
from Annotations import getApi, login_as_marry, login_as_junior_keeper

@login_as_marry
def createAnimalActivityLog(mockData, useAPI: UseAPI):
    res = useAPI.post("/api/animal/createAnimalActivityLog", 
                      json=mockData)
    response_json = res.json()
    assert("animalObservationLog" in response_json)
    assert(response_json["animalObservationLog"]["details"] == mockData["details"])
    mockData["animalActivityLogId"] = response_json["animalObservationLog"]["animalActivityLogId"]

@login_as_marry
def getAnimalActivityLogById(mockData, useAPI: UseAPI):
    res = useAPI.get("/api/animal/getAnimalActivityLogById/{}".format(mockData["animalActivityLogId"]))
    response_json = res.json()
    assert("animalActivityLog" in response_json)
    assert(response_json["animalActivityLog"]["details"] == mockData["details"])

@login_as_marry
def getAnimalActivityLogsByAnimalCode(animalCode, mockData, useAPI: UseAPI):
    res = useAPI.get("/api/animal/getAnimalActivityLogsByAnimalCode/{}".format(animalCode))
    response_json = res.json()
    assert("animalActivityLogs" in response_json)
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
    assert("animalActivityLog" in response_json)
    assert(response_json["animalActivityLog"]["details"] == mockData["details"])

@login_as_marry
def deleteAnimalActivityLogById(mockData, useAPI: UseAPI):
    res = useAPI.delete("/api/animal/deleteAnimalActivityLogById/{}".format(mockData["animalActivityLogId"]),
                     mockData)
    response_json = res.json()
    assert("result" in response_json)
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
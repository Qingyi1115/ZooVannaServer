from Json import newRepairTicketDetails
from Annotations import UseAPI, getApi, login_as_marry, login_as_junior_keeper
from time import time
import json

# Facility Logs API
@login_as_marry
def createFacilityLog(mockData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createFacilityLog/1", 
                      json=mockData)
    response_json = res.json()
    assert "facilityLog" in response_json, "No facilityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert response_json["facilityLog"]["details"] == mockData["details"], "Data does not match"
    mockData["facilityLogId"] = response_json["facilityLog"]["facilityLogId"]

@login_as_marry
def getFacilityLog(mockData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/getFacilityLog/{}".format(mockData["facilityLogId"]),
                      json={"facilityLogId":["inHouse", "generalStaffs"]})
    response_json = res.json()
    assert "facilityLog" in response_json, "No facilityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert response_json["facilityLog"]["details"] == mockData["details"], "Data does not match"

@login_as_marry
def updateFacilityLog(mockData, useAPI: UseAPI):
    mockData["title"] = "new title hahaha"
    res = useAPI.put("/api/assetFacility/updateFacilityLog/{}".format(mockData["facilityLogId"]),
                     json=mockData)
    response_json = res.json()
    assert "facilityLog" in response_json, "No facilityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert response_json["facilityLog"]["title"] == mockData["title"], "Data does not match"

@login_as_marry
def completeRepairTicket(mockData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/completeRepairTicket/{}".format(mockData["facilityLogId"]))
    response_json = res.json()
    assert "result" in response_json, "No facilityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert response_json["result"] == "success", "Data does not match"

    res = useAPI.post("/api/assetFacility/getFacilityLog/{}".format(mockData["facilityLogId"]),
                      json={"includes":["generalStaffs"]})
    response_json = res.json()
    assert "facilityLog" in response_json, "No facilityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert len(response_json["facilityLog"]["generalStaffs"])== 0, "Data does not match"

@login_as_marry
def deleteFacilityLog(mockData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteFacilityLog/{}".format(mockData["facilityLogId"]))
    response_json = res.json()
    assert "result" in response_json, "No facilityLog! " + ("" if "error" not in response_json else response_json["error"])
    assert response_json["result"] == "success", "Data does not match"

FACILITY_LOG_API_TESTS = [
    (createFacilityLog, newRepairTicketDetails), 
    (getFacilityLog, newRepairTicketDetails),
    (updateFacilityLog, newRepairTicketDetails),
    (completeRepairTicket,newRepairTicketDetails),
    (deleteFacilityLog,newRepairTicketDetails),
]
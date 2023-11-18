from JsonData import newRepairTicketDetails, newFacility, newCustomerReportLog, newAnimalFeed, newEnrichmentItem, newHub
from Annotations import UseAPI, getApi, login_as_marry, login_as_junior_keeper
from time import time
import json

# Facility API
@getApi
def createFacility_fail(facilityData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createFacility",
                      json=facilityData)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def createFacility_success(facilityData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createFacility",
                     json=facilityData)
    response_json = res.json()
    assert "facility" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())
    facilityData["facilityId"] = response_json["facility"]["facilityId"]

@getApi
def getAllFacility_fail(useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/getAllFacility",
                     json={
                         "includes" : []
                     })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getAllFacility_success(useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/getAllFacility",
                     json={
                         "includes" : []
                     })
    response_json = res.json()
    assert "facilities" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def getMyOperationFacility_fail(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getMyOperationFacility")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getMyOperationFacility_success(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getMyOperationFacility")
    response_json = res.json()
    assert "facility" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def getMyMaintainedFacility_fail(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getMyMaintainedFacility")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getMyMaintainedFacility_success(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getMyMaintainedFacility")
    response_json = res.json()
    assert "facilities" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def getFacility_fail(facilityData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/getFacility/{}".format("Fake-Id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def getFacility_success(facilityData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/getFacility/{}".format(facilityData["facilityId"]))
    response_json = res.json()
    assert "facility" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def getFacilityMaintenanceSuggestions_fail(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getFacilityMaintenanceSuggestions")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getFacilityMaintenanceSuggestions_success(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getFacilityMaintenanceSuggestions")
    response_json = res.json()
    assert "facilities" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def getFacilityMaintenancePredictionValues_fail(facilityData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getFacilityMaintenancePredictionValues/{}".format("Fake-Id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def getFacilityMaintenancePredictionValues_success(facilityData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getFacilityMaintenancePredictionValues/{}".format(facilityData["facilityId"]))
    response_json = res.json()
    assert "values" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def updateFacility_fail(facilityData, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/updateFacility/{}".format("Fake-Id"),
                     json=facilityData)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def updateFacility_success(facilityData, useAPI: UseAPI):
    facilityData["facilityName"] = "New Fake Shelter"
    res = useAPI.put("/api/assetFacility/updateFacility/{}".format(facilityData["facilityId"]),
                     json=facilityData)
    response_json = res.json()
    assert "facility" in response_json, response_json
    assert response_json["facility"]["facilityName"] == facilityData["facilityName"], response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def getAssignedMaintenanceStaffOfFacility_fail(facilityData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAssignedMaintenanceStaffOfFacility/{}".format("Fake-Id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def getAssignedMaintenanceStaffOfFacility_success(facilityData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAssignedMaintenanceStaffOfFacility/{}".format(facilityData["facilityId"]))
    response_json = res.json()
    assert "maintenanceStaffs" in response_json, response_json
    assert isinstance(response_json["maintenanceStaffs"], list), response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def assignMaintenanceStaffToFacility_fail(facilityData, employeeIds, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/assignMaintenanceStaffToFacility/{}".format("Fake-Id"),
                     json={"employeeIds":employeeIds})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def assignMaintenanceStaffToFacility_success(facilityData, employeeIds, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/assignMaintenanceStaffToFacility/{}".format(facilityData["facilityId"]),
                     json={"employeeIds":employeeIds})
    response_json = res.json()
    assert "inHouse" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def removeMaintenanceStaffFromFacility_fail(facilityData, employeeIds, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/removeMaintenanceStaffFromFacility/{}".format("Fake-Id"),
                     json={"employeeIds":employeeIds})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def removeMaintenanceStaffFromFacility_success(facilityData, employeeIds, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/removeMaintenanceStaffFromFacility/{}".format(facilityData["facilityId"]),
                     json={"employeeIds":employeeIds})
    response_json = res.json()
    assert "inHouse" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def assignOperationStaffToFacility_fail(facilityData, employeeIds, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/assignOperationStaffToFacility/{}".format("Fake-Id"),
                     json={"employeeIds":employeeIds})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def assignOperationStaffToFacility_success(facilityData, employeeIds, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/assignOperationStaffToFacility/{}".format(facilityData["facilityId"]),
                     json={"employeeIds":employeeIds})
    response_json = res.json()
    assert "inHouse" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def removeOperationStaffFromFacility_fail(facilityData, employeeIds, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/removeOperationStaffFromFacility/{}".format("Fake-Id"),
                     json={"employeeIds":employeeIds})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def removeOperationStaffFromFacility_success(facilityData, employeeIds, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/removeOperationStaffFromFacility/{}".format(facilityData["facilityId"]),
                     json={"employeeIds":employeeIds})
    response_json = res.json()
    assert "inHouse" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def getAllCustomerReportLogs_fail(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllCustomerReportLogs")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getAllCustomerReportLogs_success(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllCustomerReportLogs")
    response_json = res.json()
    assert "customerReportLogs" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def crowdLevelByFacilityId_fail(facilityData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/crowdLevelByFacilityId/{}".format("Fake-Id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@getApi
def crowdLevelByFacilityId_success(facilityData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/crowdLevelByFacilityId/{}".format(facilityData["facilityId"]))
    response_json = res.json()
    assert "crowdLevel" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def getAllFacilityCustomer_success(useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/getAllFacilityCustomer",
                      json={"includes":[]})
    response_json = res.json()
    assert "facilities" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def createCustomerReportLog_fail(facilityData, customerLogData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createCustomerReportLog/{}".format("Fake-Id"),
                      json=customerLogData)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@getApi
def createCustomerReportLog_success(facilityData, customerLogData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createCustomerReportLog/{}".format(facilityData["facilityId"]),
                      json=customerLogData)
    response_json = res.json()
    assert "customerReportLog" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())
    customerLogData["customerReportLogId"] = response_json["customerReportLog"]["customerReportLogId"]

@login_as_marry
def getCustomerReportLog_fail(customerLogData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getCustomerReportLog/{}".format("Fake-Id"),
                      json=customerLogData)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def getCustomerReportLog_success(customerLogData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getCustomerReportLog/{}".format(customerLogData["customerReportLogId"]),
                      json=customerLogData)
    response_json = res.json()
    assert "customerReportLog" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())
    customerLogData["customerReportLogId"] = response_json["customerReportLog"]["customerReportLogId"]

@getApi
def getAllNonViewedCustomerReportLogs_fail(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllNonViewedCustomerReportLogs")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getAllNonViewedCustomerReportLogs_success(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllNonViewedCustomerReportLogs")
    response_json = res.json()
    assert "customerReportLogs" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def getAllCustomerReportLogsByFacilityId_fail(facilityData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllCustomerReportLogsByFacilityId/{}".format("Fake-Id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def getAllCustomerReportLogsByFacilityId_success(facilityData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllCustomerReportLogsByFacilityId/{}".format(facilityData["facilityId"]))
    response_json = res.json()
    assert "customerReportLogs" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def updateCustomerReportLogs_fail(customerLogData, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/updateCustomerReportLogs",
                     json={
                         "customerReportLogId" : "Fake-Id",
                         "viewed" : True
                     })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def updateCustomerReportLogs_success(customerLogData, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/updateCustomerReportLogs",
                     json={
                         "customerReportLogId" : customerLogData["customerReportLogId"],
                         "viewed" : True
                     })
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def markCustomerReportLogsViewed_fail(customerLogData, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/markCustomerReportLogsViewed",
                     json={
                         "customerReportLogIds" : ["Fake-Id"],
                         "viewed" : True
                     })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def markCustomerReportLogsViewed_success(customerLogData, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/markCustomerReportLogsViewed",
                     json={
                         "customerReportLogIds" : [customerLogData["customerReportLogId"]],
                         "viewed" : True
                     })
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def deleteCustomerReportLog_fail(customerLogData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteCustomerReportLog/{}".format("Fake id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def deleteCustomerReportLog_success(customerLogData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteCustomerReportLog/{}".format(customerLogData["customerReportLogId"]))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def deleteFacility_fail(facilityData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteFacility/{}".format("Fake id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def deleteFacility_success(facilityData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteFacility/{}".format(facilityData["facilityId"]))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())


    
FACILITY_API_TESTS = [
    # Create mock facility
    (createFacility_fail, newFacility), 
    (createFacility_success, newFacility), 
    (getAllFacility_fail, ), 
    (getAllFacility_success, ), 
    (getMyOperationFacility_fail, ), 
    (getMyOperationFacility_success, ), 
    (getMyOperationFacility_fail, ), 
    (getMyOperationFacility_success, ), 
    (getMyMaintainedFacility_fail, ), 
    (getMyMaintainedFacility_success, ), 
    (getFacility_fail, newFacility), 
    (getFacility_success, newFacility), 
    (getFacilityMaintenanceSuggestions_fail, ), 
    (getFacilityMaintenanceSuggestions_success, ), 
    (getFacilityMaintenancePredictionValues_fail, newFacility), 
    (getFacilityMaintenancePredictionValues_success, newFacility), 
    (updateFacility_fail, newFacility), 
    (updateFacility_success, newFacility), 
    (getAssignedMaintenanceStaffOfFacility_fail, newFacility), 
    (getAssignedMaintenanceStaffOfFacility_success, newFacility), 
    (assignMaintenanceStaffToFacility_fail, newFacility, [12]), 
    (assignMaintenanceStaffToFacility_success, newFacility, [12]), 
    (removeMaintenanceStaffFromFacility_fail, newFacility, [12]), 
    (removeMaintenanceStaffFromFacility_success, newFacility, [12]), 
    (assignOperationStaffToFacility_fail, newFacility, [10,11]), 
    (assignOperationStaffToFacility_success, newFacility, [10,11]), 
    (removeOperationStaffFromFacility_fail, newFacility, [10,11]), 
    (removeOperationStaffFromFacility_success, newFacility, [10,11]), 
    (getAllCustomerReportLogs_fail, ), 
    (getAllCustomerReportLogs_success, ), 
    (crowdLevelByFacilityId_fail, newFacility), 
    (crowdLevelByFacilityId_success, newFacility),
    (getAllFacilityCustomer_success, ), 

    # Customer Report Log tests
    (createCustomerReportLog_fail, newFacility, newCustomerReportLog), 
    (createCustomerReportLog_success, newFacility, newCustomerReportLog),
    (getCustomerReportLog_fail, newCustomerReportLog), 
    (getCustomerReportLog_success, newCustomerReportLog),
    (getAllNonViewedCustomerReportLogs_fail, ), 
    (getAllNonViewedCustomerReportLogs_success, ), 
    (getAllCustomerReportLogsByFacilityId_fail, newFacility), 
    (getAllCustomerReportLogsByFacilityId_success, newFacility),
    (updateCustomerReportLogs_fail, newCustomerReportLog), 
    (updateCustomerReportLogs_success, newCustomerReportLog), 
    (markCustomerReportLogsViewed_fail, newCustomerReportLog), 
    (markCustomerReportLogsViewed_success, newCustomerReportLog), 
    (deleteCustomerReportLog_fail, newCustomerReportLog), 
    (deleteCustomerReportLog_success, newCustomerReportLog), 

    # Delete mock facility
    (deleteFacility_fail, newFacility), 
    (deleteFacility_success, newFacility), 
]

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

# Animal Feed API test
@login_as_marry
def createNewAnimalFeed_fail(animalFeedData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createNewAnimalFeed",
                      json={"no data" : "still no data"})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def createNewAnimalFeed_success(animalFeedData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createNewAnimalFeed",
                      json=animalFeedData)
    response_json = res.json()
    assert "animalFeed" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())
    animalFeedData["animalFeedId"] = response_json["animalFeed"]["animalFeedId"]

@getApi
def getAllAnimalFeed_fail(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllAnimalFeed")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getAllAnimalFeed_success(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllAnimalFeed")
    response_json = res.json()
    assert "animalFeeds" in response_json, response_json
    assert isinstance(response_json["animalFeeds"], list), response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def getAnimalFeed_fail(animalFeedData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAnimalFeed/{}".format("Fake-name"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def getAnimalFeed_success(animalFeedData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAnimalFeed/{}".format(animalFeedData["animalFeedName"]))
    response_json = res.json()
    assert "animalFeed" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def getAnimalFeedById_fail(animalFeedData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAnimalFeedById/{}".format("Fake-id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def getAnimalFeedById_success(animalFeedData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAnimalFeedById/{}".format(animalFeedData["animalFeedId"]))
    response_json = res.json()
    assert "animalFeed" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def updateAnimalFeed_fail(animalFeedData, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/updateAnimalFeed",
                     json={"no data" : "no data"})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def updateAnimalFeed_success(animalFeedData, useAPI: UseAPI):
    animalFeedData["animalFeedName"] = "tofu with chocolate"
    res = useAPI.put("/api/assetFacility/updateAnimalFeed",
                     json=animalFeedData)
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@getApi
def deleteAnimalFeed_fail(animalFeedData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteAnimalFeed/{}".format("fake-animalFeedName"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def deleteAnimalFeed_success(animalFeedData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteAnimalFeed/{}".format(animalFeedData["animalFeedName"]))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

# Enrightmenet Items Api test
@login_as_marry
def createNewEnrichmentItem_fail(enrichmentItemData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createNewEnrichmentItem",
                      json={"no data":"Nope"})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def createNewEnrichmentItem_success(enrichmentItemData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/createNewEnrichmentItem",
                      json=enrichmentItemData)
    response_json = res.json()
    assert "enrichmentItem" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())
    enrichmentItemData["enrichmentItemId"] = response_json["enrichmentItem"]["enrichmentItemId"]

@getApi
def getAllEnrichmentItem_fail(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllEnrichmentItem")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getAllEnrichmentItem_success(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllEnrichmentItem")
    response_json = res.json()
    assert isinstance(response_json, list), response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def getEnrichmentItem_fail(enrichmentItemData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getEnrichmentItem/{}".format("Fake-id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def getEnrichmentItem_success(enrichmentItemData, useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getEnrichmentItem/{}".format(enrichmentItemData["enrichmentItemId"]))
    response_json = res.json()
    assert "enrichmentItem" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def updateEnrichmentItem_fail(enrichmentItemData, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/updateEnrichmentItem",
                     json={"nodata": "no-data"})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def updateEnrichmentItem_success(enrichmentItemData, useAPI: UseAPI):
    enrichmentItemData["enrichmentItemName"] = "a PUSH-up bar"
    res = useAPI.put("/api/assetFacility/updateEnrichmentItem",
                     json=enrichmentItemData)
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def deleteEnrichmentItem_fail(enrichmentItemData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteEnrichmentItem/{}".format("Fake-name"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def deleteEnrichmentItem_success(enrichmentItemData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteEnrichmentItem/{}".format(enrichmentItemData["enrichmentItemName"]))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def addHub_fail(hubData, facilityId, useAPI: UseAPI):
    if "facilityId" in hubData: del hubData["facilityId"]
    res = useAPI.post("/api/assetFacility/addHub",
                        json=hubData)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry
def addHub_success(hubData, facilityId, useAPI: UseAPI):
    hubData["facilityId"] = facilityId
    res = useAPI.post("/api/assetFacility/addHub",
                        json=hubData)
    response_json = res.json()
    assert "hubProcessor" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())
    hubData["hubProcessorId"] = response_json["hubProcessor"]["hubProcessorId"]

@getApi
def getAllHubs_fail(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllHubs")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!" + str(res.status_code())

@login_as_marry
def getAllHubs_success(useAPI: UseAPI):
    res = useAPI.get("/api/assetFacility/getAllHubs")
    response_json = res.json()
    assert "hubs" in response_json, response_json
    assert isinstance(response_json["hubs"], list) , response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def getHub_fail(hubData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/getHub/{}".format("fake-id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry 
def getHub_success(hubData, useAPI: UseAPI):
    res = useAPI.post("/api/assetFacility/getHub/{}".format(hubData["hubProcessorId"]))
    response_json = res.json()
    assert "hubProcessor" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def updateHub_fail(hubData, useAPI: UseAPI):
    res = useAPI.put("/api/assetFacility/updateHub/{}".format("fake-id"),
                      json={"no data" : "nope"})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry 
def updateHub_success(hubData, useAPI: UseAPI):
    hubData["radioGroup"] = 190
    res = useAPI.put("/api/assetFacility/updateHub/{}".format(hubData["hubProcessorId"]),
                      json=hubData)
    response_json = res.json()
    assert "hub" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

@login_as_marry
def deleteHub_fail(hubData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteHub/{}".format("fake-id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!" + str(res.status_code())

@login_as_marry 
def deleteHub_success(hubData, useAPI: UseAPI):
    res = useAPI.delete("/api/assetFacility/deleteHub/{}".format(hubData["hubProcessorId"]))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" + str(res.status_code())

ASSET_API_TEST = [
    # Animal Feed
    (createNewAnimalFeed_fail, newAnimalFeed),
    (createNewAnimalFeed_success, newAnimalFeed),
    (getAllAnimalFeed_fail, ),
    (getAllAnimalFeed_success, ),
    (getAnimalFeed_fail, newAnimalFeed),
    (getAnimalFeed_success, newAnimalFeed),
    (getAnimalFeedById_fail, newAnimalFeed),
    (getAnimalFeedById_success, newAnimalFeed),
    (updateAnimalFeed_fail, newAnimalFeed),
    (updateAnimalFeed_success, newAnimalFeed),
    (deleteAnimalFeed_fail, newAnimalFeed),
    (deleteAnimalFeed_success, newAnimalFeed),

    # Enrichment Items
    (createNewEnrichmentItem_fail, newEnrichmentItem),
    (createNewEnrichmentItem_success, newEnrichmentItem),
    (getAllEnrichmentItem_fail, ),
    (getAllEnrichmentItem_success, ),
    (getEnrichmentItem_fail, newEnrichmentItem),
    (getEnrichmentItem_success, newEnrichmentItem),
    (updateEnrichmentItem_fail, newEnrichmentItem),
    (updateEnrichmentItem_success, newEnrichmentItem),
    (deleteEnrichmentItem_fail, newEnrichmentItem),
    (deleteEnrichmentItem_success, newEnrichmentItem),

    #  Hubs
    (addHub_fail, newHub, 1),
    (addHub_success, newHub, 1),
    (getAllHubs_fail, ),
    (getAllHubs_success, ),
    (getHub_fail, newHub, ),
    (getHub_success, newHub, ),
    (updateHub_fail, newHub, ),
    (updateHub_success, newHub, ),
    (deleteHub_fail, newHub, ),
    (deleteHub_success, newHub, ),
]
from JsonData import newRepairTicketDetails, newFacility, newCustomerReportLog
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
    (assignMaintenanceStaffToFacility_fail, newFacility, [8]), 
    (assignMaintenanceStaffToFacility_success, newFacility, [8]), 
    (removeMaintenanceStaffFromFacility_fail, newFacility, [8]), 
    (removeMaintenanceStaffFromFacility_success, newFacility, [8]), 
    (assignOperationStaffToFacility_fail, newFacility, [5,6]), 
    (assignOperationStaffToFacility_success, newFacility, [5,6]), 
    (removeOperationStaffFromFacility_fail, newFacility, [5,6]), 
    (removeOperationStaffFromFacility_success, newFacility, [5,6]), 
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
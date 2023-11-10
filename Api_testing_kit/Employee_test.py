from Annotations import UseAPI
from JsonData import marry_account, junior_keeper, new_user_dat
from Annotations import getApi, login_as_marry, login_as_junior_keeper

@getApi
def test_login_should_fail(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/login", 
                      json={"email":mock_data["employeeEmail"], 
                            "password":"not a legit password"})
    response_json = res.json()
    assert("error" in response_json)
    assert(response_json["error"] == "Password inccorrect!")

@getApi
def test_login_should_succeed(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/login", 
                      json={"email":mock_data["employeeEmail"], 
                            "password":mock_data["password"]})
    response_json = res.json()
    assert(response_json["employeeData"]["employeeEmail"] == mock_data["employeeEmail"])
    assert("token" in response_json)
    mock_data["token"] = response_json["token"]

LOGIN_API_TESTS = [
    (test_login_should_fail, junior_keeper), 
    (test_login_should_succeed, marry_account), 
    (test_login_should_succeed, junior_keeper), 
]

@login_as_junior_keeper
def createEmployee_should_fail(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/createEmployee", 
                      json=mock_data)
    response_json = res.json()
    assert("error" in response_json or "errors" in response_json)

@login_as_marry
def createEmployee_should_succeed(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/createEmployee", json=mock_data)
    response_json = res.json()    
    assert "created" in response_json, response_json["error"]
    mock_data["password"] = response_json["password"]
    mock_data["employeeId"] = response_json["created"]["employeeId"]

@login_as_marry
def getEmployee_success(mock_data, useAPI: UseAPI):
    res = useAPI.get("/api/employee/getEmployee/{}".format(mock_data["employeeId"]))
    response_json = res.json()    
    assert "employee" in response_json, response_json
    assert mock_data["employeeName"] == response_json["employee"]["employeeName"], "Name not equal!"

@login_as_junior_keeper
def getEmployee_fail(mock_data, useAPI: UseAPI):
    res = useAPI.get("/api/employee/getEmployee/{}".format(mock_data["employeeId"]))
    response_json = res.json()    
    assert "error" in response_json, response_json

# Can only run once
# @login_as_marry
# def updateEmployeeAccount(mock_data, useAPI: UseAPI):
#     mock_data["employeeEducation"] = "Test updated education"
#     res = useAPI.put("/api/employee/updateEmployeeAccount",
#                      json=mock_data)
#     response_json = res.json()    
#     assert "employee" in response_json, response_json
#     assert mock_data["employeeEducation"] == response_json["employee"]["employeeEducation"], "Name not equal!"

@login_as_marry
def setAccountManager_success(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/setAccountManager/{}".format(mock_data["employeeId"]),
                     json={})
    response_json = res.json()    
    assert "employee" in response_json, response_json
    assert True == response_json["employee"]["isAccountManager"], "isAccountManager not updated!"

@login_as_junior_keeper
def setAccountManager_fail(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/setAccountManager/{}".format(mock_data["employeeId"]),
                     json={})
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def unsetAccountManager_success(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/unsetAccountManager/{}".format(mock_data["employeeId"]),
                     json={})
    response_json = res.json()    
    assert "employee" in response_json, response_json
    assert False == response_json["employee"]["isAccountManager"], "isAccountManager not updated!"

@login_as_junior_keeper
def unsetAccountManager_fail(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/unsetAccountManager/{}".format(mock_data["employeeId"]),
                     json={})
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def getAllEmployees_success(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/getAllEmployees",
                     json={})
    response_json = res.json()    
    assert "employees" in response_json, response_json
    assert next(filter(lambda x:x["employeeName"]==mock_data["employeeName"],response_json["employees"])), "Employee not found!"
    
@login_as_junior_keeper
def getAllEmployees_fail(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/getAllEmployees",
                     json={})
    response_json = res.json()    
    assert "error" in response_json, response_json
   
@login_as_marry
def getAllGeneralStaffs_success(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/getAllGeneralStaffs",
                     json={})
    response_json = res.json()    
    assert "generalStaffs" in response_json, response_json
    assert next(filter(lambda x:x["employee"]["employeeName"]==mock_data["employeeName"],response_json["generalStaffs"])), "Employee not found!"
    
@login_as_junior_keeper
def getAllGeneralStaffs_fail(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/getAllGeneralStaffs",
                     json={})
    response_json = res.json()    
    assert "error" in response_json, response_json
   
@login_as_marry
def resetPassword_success(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/resetPassword/{}".format(mock_data["employeeId"]),
                     json={})
    response_json = res.json()    
    assert "message" in response_json, response_json

@login_as_junior_keeper
def resetPassword_fail(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/resetPassword/{}".format(mock_data["employeeId"]),
                     json={})
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def disableEmployee_success(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/disableEmployee/{}".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "date" in response_json, response_json

@login_as_junior_keeper
def disableEmployee_fail(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/disableEmployee/{}".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def enableRole_success(mock_data, useAPI: UseAPI):
    mock_data["role"] = "Keeper"
    mock_data["roleJson"] = {
        "keeperType":"KEEPER",
        "specialization" :"FISH",
    }
    res = useAPI.put("/api/employee/getEmployee/{}/enableRole".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "message" in response_json, response_json

@login_as_junior_keeper
def enableRole_fail(mock_data, useAPI: UseAPI):
    mock_data["role"] = "Keeper"
    mock_data["roleJson"] = {
        "keeperType":"KEEPER",
        "specialization" :"FISH",
    }
    res = useAPI.put("/api/employee/getEmployee/{}/enableRole".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def disableRole_success(mock_data, useAPI: UseAPI):
    mock_data["role"] = "Keeper"
    mock_data["roleJson"] = {
        "keeperType":"KEEPER",
        "specialization" :"FISH",
    }
    res = useAPI.put("/api/employee/getEmployee/{}/disableRole".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "message" in response_json, response_json

@login_as_junior_keeper
def disableRole_fail(mock_data, useAPI: UseAPI):
    mock_data["role"] = "Keeper"
    mock_data["roleJson"] = {
        "keeperType":"KEEPER",
        "specialization" :"FISH",
    }
    res = useAPI.put("/api/employee/getEmployee/{}/disableRole".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def updateRoleType_success(mock_data, useAPI: UseAPI):
    mock_data["role"] = "Keeper"
    mock_data["roleType"] = "SENIOR_KEEPER"
    res = useAPI.put("/api/employee/getEmployee/{}/updateRoleType".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "message" in response_json, response_json

@login_as_junior_keeper
def updateRoleType_fail(mock_data, useAPI: UseAPI):
    mock_data["role"] = "Keeper"
    mock_data["roleType"] = "SENIOR_KEEPER"
    res = useAPI.put("/api/employee/getEmployee/{}/updateRoleType".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def updateSpecializationType_success(mock_data, useAPI: UseAPI):
    mock_data["role"] = "Keeper"
    mock_data["specializationType"] = "AMPHIBIAN"
    res = useAPI.put("/api/employee/getEmployee/{}/updateSpecializationType".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "message" in response_json, response_json

@login_as_junior_keeper
def updateSpecializationType_fail(mock_data, useAPI: UseAPI):
    mock_data["role"] = "Keeper"
    mock_data["specializationType"] = "AMPHIBIAN"
    res = useAPI.put("/api/employee/getEmployee/{}/updateSpecializationType".format(mock_data["employeeId"]),
                     json=mock_data)
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def addEnclosureToKeeper_success(mock_data, useAPI: UseAPI):
    api_loc = "/api/employee/getEmployee/{}/addEnclosure".format(mock_data["employeeId"])
    res = useAPI.put(api_loc,
                     json={"enclosureIds" : [1]})
    response_json = res.json()    
    assert "result" in response_json, response_json

@login_as_junior_keeper
def addEnclosureToKeeper_fail(mock_data, useAPI: UseAPI):
    api_loc = "/api/employee/getEmployee/{}/addEnclosure".format(mock_data["employeeId"])
    res = useAPI.put(api_loc,
                     json={"enclosureIds" : [1]})
    response_json = res.json()    
    assert "error" in response_json, response_json

@login_as_marry
def removeEnclosureFromKeeper_success(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/getEmployee/{}/removeEnclosure".format(mock_data["employeeId"]),
                     json={"enclosureIds" : [1]})
    response_json = res.json()    
    assert "result" in response_json, response_json

@login_as_junior_keeper
def removeEnclosureFromKeeper_fail(mock_data, useAPI: UseAPI):
    res = useAPI.put("/api/employee/getEmployee/{}/removeEnclosure".format(mock_data["employeeId"]),
                     json={"enclosureIds" : [1]})
    response_json = res.json()    
    assert "error" in response_json, response_json

EMPLOYEE_API_TESTS = [
    (createEmployee_should_fail, new_user_dat),
    (createEmployee_should_succeed, new_user_dat),
    (getEmployee_fail, new_user_dat),
    (getEmployee_success, new_user_dat),
    # (updateEmployeeAccount_success, new_user_dat),
    # (updateEmployeeAccount_fail, new_user_dat),
    (setAccountManager_success, new_user_dat),
    (setAccountManager_fail, new_user_dat),
    (unsetAccountManager_success, new_user_dat),
    (unsetAccountManager_fail, new_user_dat),
    (getAllEmployees_success, new_user_dat),
    (getAllEmployees_fail, new_user_dat),
    (getAllGeneralStaffs_success, new_user_dat),
    (getAllGeneralStaffs_fail, new_user_dat),
    (resetPassword_success, new_user_dat),
    (resetPassword_fail, new_user_dat),
    (enableRole_success, new_user_dat),
    (enableRole_fail, new_user_dat),
    (disableRole_success, new_user_dat),
    (disableRole_fail, new_user_dat),
    (enableRole_success, new_user_dat),
    (enableRole_fail, new_user_dat),
    (updateRoleType_success, new_user_dat),
    (updateRoleType_fail, new_user_dat),
    (updateSpecializationType_success, new_user_dat),
    (updateSpecializationType_fail, new_user_dat),
    # (addEnclosureToKeeper_success, new_user_dat),
    # (addEnclosureToKeeper_fail, new_user_dat),
    # (removeEnclosureFromKeeper_success, new_user_dat),
    # (removeEnclosureFromKeeper_fail, new_user_dat),
    (disableEmployee_success, new_user_dat),
    (disableEmployee_fail, new_user_dat),
]
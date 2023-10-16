from Annotations import UseAPI
from Json import marry_account, junior_keeper, new_user_dat
from Annotations import getApi, login_as_marry, login_as_junior_keeper

@getApi
def test_login_should_fail(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/login", 
                      json={"email":mock_data["employeeEmail"], 
                            "password":"not a legit password"})
    response_json = res.json()
    assert("error" in response_json)
    assert(response_json["error"] == "Password inccorrect!")
    print("Testing login should succeed passed!\n")

@getApi
def test_login_should_succeed(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/login", 
                      json={"email":mock_data["employeeEmail"], 
                            "password":mock_data["password"]})
    response_json = res.json()
    assert(response_json["employeeData"]["employeeEmail"] == mock_data["employeeEmail"])
    assert("token" in response_json)
    mock_data["token"] = response_json["token"]
    print("Testing login should succeed passed!\n")

LOGIN_API_TESTS = [
    (test_login_should_fail, junior_keeper), 
    (test_login_should_succeed, marry_account), 
    (test_login_should_succeed, junior_keeper), 
]

@login_as_junior_keeper
def create_user_should_fail(useAPI: UseAPI):
    res = useAPI.post("/api/employee/createEmployee", 
                      json=new_user_dat)
    response_json = res.json()
    assert("error" in response_json or "errors" in response_json)
    print("Create User Shoud fail passed!\n")

# @login_as_marry
# def create_user_should_succeed(header):
#     res = requests.post(url=BASE_URL + "/api/employee/createEmployee", json=new_user_dat, headers=header)
    # response_json = res.json()    
#     assert("created" in response_json)
#     STORE["new_emp_id"] = response_json["created"]["employeeId"]
#     print("Create user should success passed!\n")

USERS_API_TESTS = [
    (create_user_should_fail, ),
]

import hashlib, time

marry_account = {
    "employeeName":"marry", 
    "employeeAddress":"Singapore Kent Ridge LT19",
    "employeeEmail":"marry@gmail.com",
    "employeePhoneNumber": "911",
    "password" : "marry_password",
    "employeePasswordHash": hashlib.sha256(("marry_password" + "NaCl").encode('UTF-8')).hexdigest(), 
    "employeeSalt": "NaCl",
    "employeeDoorAccessCode":"123456",
    "employeeEducation":"PHD in not eating",
    "employeeBirthDate" : time.time(),
    "isAccountManager": True,
}

junior_keeper = {
    "employeeName":"john", 
    "employeeAddress":"Singapore Kent Ridge LT17",
    "employeeEmail":"john@gmail.com",
    "employeePhoneNumber": "912",
    "password" : "john_password",
    "employeePasswordHash": hashlib.sha256(("john_password" + "NaAg").encode('UTF-8')).hexdigest(), 
    "employeeSalt":"NaAg",
    "employeeDoorAccessCode":"234567",
    "employeeEducation":"PHD in not sleeping",
    "employeeBirthDate" : time.time(),
    "isAccountManager": False,
}

new_user_dat = {
    "employeeName":"manager3", 
    "employeeAddress":"Singapore Kent Ridge LT14",
    "employeeEmail":"manager3@gmail.com",
    "employeePhoneNumber": "0001",
    "employeeEducation":"Math Major",
    "employeeBirthDate" : time.time(),
    "isAccountManager":True,
    "role":"generalStaff",
    "roleJson": {
        "generalStaffType":"OPERATE"
    }
  }

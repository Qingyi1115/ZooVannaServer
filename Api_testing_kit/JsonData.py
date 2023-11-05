
import hashlib, time

DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24

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
    "employeeBirthDate" : time.time() * 1000,
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
    "employeeBirthDate" : time.time() * 1000,
    "isAccountManager": False,
}

qingYi_customer = {
    "firstName": "Qingyi",
    "lastName": "Xiang",
    "email": "xqy1115@gmail.com",
    "contactNo": "12345568",
    "birthday": (time.time()- DAY_IN_MILLISECONDS/1000 * 9) * 1000,
    "address" : "somewhere in india",
    "nationality": "ID",
    "passwordHash": hashlib.sha256(("Hahaha123." + "hehe").encode('UTF-8')).hexdigest(), 
    "password" : "Hahaha123.",
    "salt": "hehe",
}

import string, random
new_user_dat = {
    "employeeName":''.join(random.choice(string.ascii_lowercase) for i in range(20)), 
    "employeeAddress":"Singapore Kent Ridge LT14",
    "employeeEmail":''.join(random.choice(string.ascii_lowercase) for i in range(20))+"@gmail.com",
    "employeePhoneNumber": str(round(random.random() * 999999999)),
    "employeeEducation":"Math Major",
    "employeeBirthDate" : time.time() * 1000,
    "isAccountManager":False,
    "role":"generalStaff",
    "roleJson": {
        "generalStaffType":"ZOO_OPERATIONS"
    }
  }

newAnimalActivityDetails = {
    "activityType" : "ENRICHMENT",
    "title" : "I now do not like fishes",
    "details" : "my new animal activity",
    "startDate" : time.time() * 1000,
    "endDate" : time.time() * 1000 + DAY_IN_MILLISECONDS * 30,
    "recurringPattern" : "WEEKLY",
    "dayOfWeek" : "THURSDAY",
    "eventTimingType":"AFTERNOON",
    "durationInMinutes" : 60,
    "requiredNumberOfKeeper" : 1
}

newAnimalActivityLogDetails = {
        "activityType": "ENRICHMENT",
        "dateTime": time.time() * 1000 - DAY_IN_MILLISECONDS * 2,
        "durationInMinutes": 60,
        "sessionRating": "EXCELLENT",
        "animalReaction": "PLAYFU;L",
        "details": "Blah ... my testing value",
        "animalCodes" : ["ANM00001", "ANM00002"]
}

newRepairTicketDetails = {
    "title":"fake title",
    "details":"bladhhh...",
    "remarks" : "remarksaaaa",
    "facilityLogType" : "ACTIVE_REPAIR_TICKET",
    "employeeIds" : [8, 10]
}

new_customer_dat = {
  "password":"very_secure_string", 
  "firstName": "string",
  "lastName": "string",
  "email": "marcuscmingj@gmail.com",
  'contactNo': "99999999",
  "entryDate": (time.time() - 9000) * 1000,
  "nationality": "BJ",
}

new_customer_order = {
  "totalAmount": 123,
  "orderStatus": "COMPLETED",
  "entryDate": time.time() * 1000,
  "customerFirstName": qingYi_customer["firstName"],
  "customerLastName": qingYi_customer["lastName"],
  "customerContactNo": qingYi_customer["contactNo"],
  "customerEmail": qingYi_customer["email"],
  "paymentStatus": "COMPLETED",
  "pdfUrl": "",
  "bookingReference": "123wd1sd123wd1sdofda"
}

new_payment = {
  "amount": 123,
  "time": time.time() * 1000,
  "paymentType": "PAYNOW",
  "transactionId": "d1d2-12ds-123wd1sd",
  "description": "anything works",
}
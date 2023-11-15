from Annotations import UseAPI
from JsonData import new_customer_dat, qingYi_customer, new_customer_order, new_customer_dat, new_payment
from Annotations import getApi, login_as_QingYi
import random, string

def generate_random_string():
  return ''.join(random.choice(string.ascii_lowercase) for i in range(20))

@getApi
def createCustomer_fail(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/login", 
                      json={"email":mock_data["employeeEmail"], 
                            "password":"not a legit password"})
    response_json = res.json()
    assert("error" in response_json)
    assert(response_json["error"] == "Password inccorrect!")

@getApi
def createCustomer_succeed(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/employee/login", 
                      json={"email":mock_data["employeeEmail"], 
                            "password":"not a legit password"})
    response_json = res.json()
    assert("error" in response_json)
    assert(response_json["error"] == "Password inccorrect!")

@getApi
def login_fail(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/customer/login", 
                      json={"email":mock_data["email"], 
                            "password":"not a legit password"})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!"

@getApi
def login_success(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/customer/login", 
                      json={"email":mock_data["email"], 
                            "password":mock_data["password"]})
    response_json = res.json()
    assert "token" in response_json, response_json
    assert(response_json["email"] == mock_data["email"])
    assert res.status_code() == 200, "Status code not 200!"
    mock_data["customerId"] = response_json["customerId"]
    mock_data["token"] = response_json["token"]

@getApi
def sendForgetPasswordLink_fail(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/customer/sendForgetPasswordLink/{}".format("does-not-exist@email.com"), 
                      json={})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@getApi
def sendForgetPasswordLink_success(mock_data, useAPI: UseAPI):
    res = useAPI.post("/api/customer/sendForgetPasswordLink/{}".format(mock_data["email"]), 
                      json={})
    response_json = res.json()
    assert "message" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@getApi
def sendEmailVerification_fail(mock_data, useAPI: UseAPI):
    res = useAPI.get("/api/customer/sendEmailVerification/{}".format("does-not-exist@email.com"), 
                      json={})
    response_json = res.json()
    assert "message" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"
    
@getApi
def sendEmailVerification_success(mock_data, useAPI: UseAPI):
    res = useAPI.get("/api/customer/sendEmailVerification/{}".format(mock_data["email"]), 
                      json={})
    response_json = res.json()
    # Email has alreadly been used
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@getApi
def createTicket_fail(customer_dat, order_dat, payment_dat,  useAPI: UseAPI):
    order_dat["bookingReference"] = generate_random_string()
    res = useAPI.post("/api/customer/createTicket/{}".format("does-not-exist@email.com"), 
                      json={
                          "listings":[],
                          "customerOrder" :order_dat,
                          "payment": payment_dat
                      })
    response_json = res.json()
    assert res.status_code() == 400, "Status code not 400!"
    assert "error" in response_json, response_json

@getApi
def createTicket_success(customer_dat, order_dat, payment_dat, useAPI: UseAPI):
    order_dat["bookingReference"] = generate_random_string()
    res = useAPI.post("/api/customer/createTicket/{}".format(customer_dat["customerId"]), 
                      json={
                          "listings":[],
                          "customerOrder" :order_dat,
                          "payment": payment_dat
                      })
    response_json = res.json()
    assert res.status_code() == 200, "Status code not 200!"
    assert "result" in response_json, response_json

@getApi
def createCustomerOrderForGuest_fail(order_dat, useAPI: UseAPI):
    order_dat["bookingReference"] = generate_random_string()
    res = useAPI.post("/api/customer/createCustomerOrderForGuest", 
                      json={
                          "listings":[],
                          "customerOrder" :{},
                      })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@getApi
def createCustomerOrderForGuest_success(order_dat, useAPI: UseAPI):
    order_dat["bookingReference"] = generate_random_string()
    res = useAPI.post("/api/customer/createCustomerOrderForGuest", 
                      json={
                          "listings":[],
                          "customerOrder" :order_dat,
                      })
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"
    order_dat["customerOrderId"] = response_json["result"]["customerOrderId"]

@getApi
def completePaymentForGuest_fail(order_dat, payment_dat, useAPI: UseAPI):
    payment_dat["transactionId"] = generate_random_string()
    res = useAPI.post("/api/customer/completePaymentForGuest/{}".format("invalidId"),
                      json={
                          "payment": payment_dat
                      })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@getApi
def completePaymentForGuest_success(order_dat, payment_dat, useAPI: UseAPI):
    payment_dat["transactionId"] = generate_random_string()
    res = useAPI.post("/api/customer/completePaymentForGuest/{}".format(order_dat["customerOrderId"]), 
                      json={
                          "payment": payment_dat
                      })
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

# @getApi
# def deleteCustomer_fail(customer_dat, useAPI: UseAPI):
#     res = useAPI.delete("/api/customer/deleteCustomer/{}".format("invalidId"))
#     response_json = res.json()
#     assert "error" in response_json, response_json
#     assert res.status_code() == 400, "Status code not 400!"

# @getApi
# def deleteCustomer_success(customer_dat, useAPI: UseAPI):
#     res = useAPI.delete("/api/customer/deleteCustomer/{}".format(customer_dat["customerId"]))
#     response_json = res.json()
#     assert "result" in response_json, response_json
#     assert res.status_code() == 200, "Status code not 200!"

@getApi
def getCustomer_fail(customer_dat, useAPI: UseAPI):
    res = useAPI.get("/api/customer/getCustomer")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!"

@login_as_QingYi
def getCustomer_success(customer_dat, useAPI: UseAPI):
    res = useAPI.get("/api/customer/getCustomer")
    response_json = res.json()
    assert response_json["customerId"] == customer_dat["customerId"], response_json
    assert res.status_code() == 200, "Status code not 200!"

@getApi
# @login_as_QingYi
def updateCustomer_fail(customer_dat:dict, useAPI: UseAPI):
    new_customer_dat = customer_dat.copy()
    new_customer_dat["firstName"] = "definitely not marcus"
    new_customer_dat["email"] = "testThis@fakemail.com"
    res = useAPI.put("/api/customer/updateCustomer/{}".format(customer_dat["customerId"]-1),
                     json=new_customer_dat)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!"

@login_as_QingYi
def updateCustomer_success(customer_dat, useAPI: UseAPI):
    customer_dat["firstName"] = "My new name"
    res = useAPI.put("/api/customer/updateCustomer/{}".format(customer_dat["customerId"]),
                     json=customer_dat)
    response_json = res.json()
    assert "customer" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@getApi
# @login_as_QingYi
def updatePassword_fail(customer_dat:dict, useAPI: UseAPI):
    res = useAPI.put("/api/customer/updatePassword/{}".format(customer_dat["customerId"]-1),
                     json={
                         "oldPassword":customer_dat["password"],
                         "newPassword":"HAHA you have been hacked!"
                     })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!"

@login_as_QingYi
def updatePassword_success(customer_dat, useAPI: UseAPI):
    new_password = generate_random_string()
    old_password = customer_dat["password"]
    res = useAPI.put("/api/customer/updatePassword/{}".format(customer_dat["customerId"]),
                     json={
                         "oldPassword": old_password,
                         "newPassword": new_password
                     })
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

    # Reverse the change
    res = useAPI.put("/api/customer/updatePassword/{}".format(customer_dat["customerId"]),
                     json={
                         "oldPassword": new_password,
                         "newPassword": old_password
                     })
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_QingYi
def deleteCustomer_fail(customer_dat:dict, useAPI: UseAPI):
    res = useAPI.delete("/api/customer/deleteCustomer")
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!"

@login_as_QingYi
def deleteCustomer_success(customer_dat, useAPI: UseAPI):
    res = useAPI.delete("/api/customer/deleteCustomer")
    response_json = res.json()
    assert "customer" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_QingYi
def createCustomerOrderForCustomer_fail(customer_dat:dict, useAPI: UseAPI):
    res = useAPI.post("/api/customer/createCustomerOrderForCustomer_fail",
                    json={})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!"

@login_as_QingYi
def createCustomerOrderForCustomer_success(customer_dat, useAPI: UseAPI):
    res = useAPI.post("/api/customer/createCustomerOrderForCustomer_fail",
                    json={})
    response_json = res.json()
    assert "customer" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_QingYi
def completePaymentForCustomer_fail(customer_dat, useAPI: UseAPI):
    res = useAPI.post("/api/customer/createCustomerOrderForCustomer_fail",
                    json={})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 401, "Status code not 401!"

@login_as_QingYi
def completePaymentForCustomer_success(customer_dat, useAPI: UseAPI):
    res = useAPI.post("/api/customer/createCustomerOrderForCustomer_fail",
                    json={})
    response_json = res.json()
    assert "customer" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"


CUSTOMER_API_TESTS = [
    # (createCustomer_fail, new_customer_dat),
    # (createCustomer_succeed, new_customer_dat),
    # (resetForgottenPassword_fail, new_customer_dat),
    # (resetForgottenPassword_succeed, new_customer_dat),
    # (deleteCustomer_fail, new_customer_dat),
    # (deleteCustomer_success, new_customer_dat),
    # (deleteCustomer_fail, new_customer_dat),
    # (deleteCustomer_success, new_customer_dat),

    (login_fail, qingYi_customer),
    (login_success, qingYi_customer),
    (sendForgetPasswordLink_fail, qingYi_customer),
    (sendForgetPasswordLink_success, qingYi_customer),
    (sendEmailVerification_fail, qingYi_customer),
    (sendEmailVerification_success, qingYi_customer),
    (createTicket_fail, qingYi_customer, new_customer_order, new_payment),
    (createTicket_success, qingYi_customer, new_customer_order, new_payment),
    (createCustomerOrderForGuest_fail, new_customer_order),
    (createCustomerOrderForGuest_success, new_customer_order),
    (completePaymentForGuest_success, new_customer_order, new_payment),
    (completePaymentForGuest_fail, new_customer_order, new_payment),
    (getCustomer_fail, qingYi_customer),
    (getCustomer_success, qingYi_customer),
    (updateCustomer_fail, qingYi_customer),
    (updateCustomer_success, qingYi_customer),
    (updatePassword_fail, qingYi_customer),
    (updatePassword_success, qingYi_customer),

    # (createCustomerOrderForCustomer_fail, ),
    # (createCustomerOrderForCustomer_success, ),
    # (completePaymentForCustomer_success, ),
    # (completePaymentForCustomer_fail, ),
]
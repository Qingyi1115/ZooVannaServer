from functools import wraps
import requests
from Json import marry_account, junior_keeper

env = dict(map(lambda x:(x.strip().split("=")[0].strip(), x.strip().split("=")[1].strip()), map(lambda x:x.split("#")[0] if "=" in x.split("#")[0] else "None=None", open("./.env", "r").read().strip().split("\n"))))

SERVER_URL = env["SERVER_URL"]
SERVER_PORT = env["SERVER_PORT"]
BASE_URL = SERVER_URL + ":" + SERVER_PORT

class UseAPI:
    def __init__(self, BASE_URL, HEADER):
        self.BASE_URL = BASE_URL
        self.HEADER = HEADER
    
    def get(self, api, json):
        return requests.get(
            url=BASE_URL + api, 
            json=json)
    
    def put(self, api, json):
        return requests.put(
            url=BASE_URL + api, 
            json=json)
    
    def post(self, api, json):
        return requests.post(
            url=BASE_URL + api, 
            json=json)
    
    def delete(self, api, json):
        return requests.delete(
            url=BASE_URL + api, 
            json=json)

def getApi(func):
    return lambda*args, **kwargs : func(*args, **kwargs, useAPI = UseAPI(BASE_URL, None))

def login_as_marry(func):
    @wraps(func)
    def wrapped_call_back(*args, **kwargs):
        res = requests.post(url=BASE_URL + "/api/employee/login", 
                            json={"email":marry_account["employeeEmail"], 
                                  "password":marry_account["password"]})
        api = UseAPI(BASE_URL, {'Authorization': "Bearer " + res.json()["token"]})
        print("api", api)
        return (func(*args, **kwargs, 
                     useAPI = api))
    return wrapped_call_back

def login_as_junior_keeper(func):
    @wraps(func)
    def wrapped_call_back(*args, **kwargs):
        res = requests.post(url=BASE_URL + "/api/employee/login", 
                            json={"email":junior_keeper["employeeEmail"], 
                                  "password":junior_keeper["password"]})
        return (func(*args, **kwargs, 
                     useAPI = UseAPI(BASE_URL, {'Authorization': "Bearer " + res.json()["token"]})))
    return wrapped_call_back


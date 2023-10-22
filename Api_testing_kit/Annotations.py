from functools import wraps
import requests
from Json import marry_account, junior_keeper

env = dict(map(lambda x:(x.strip().split("=")[0].strip(), x.strip().split("=")[1].strip()), map(lambda x:x.split("#")[0] if "=" in x.split("#")[0] else "None=None", open("./.env", "r").read().strip().split("\n"))))

SERVER_URL = env["SERVER_URL"]
SERVER_PORT = env["SERVER_PORT"]
BASE_URL = SERVER_URL + ":" + SERVER_PORT

class UseAPI:
    def __init__(self, BASE_URL, header):
        self.BASE_URL = BASE_URL
        self.header = header
    
    def get(self, api, json=None):
        self.req = requests.get(
            url=BASE_URL + api, 
            json=json,
            headers=self.header)
        return self
    
    def put(self, api, json=None):
        self.req = requests.put(
            url=BASE_URL + api, 
            json=json,
            headers=self.header)
        return self
    
    def post(self, api, json=None):
        self.req = requests.post(
            url=BASE_URL + api, 
            json=json,
            headers=self.header)
        return self
    
    def delete(self, api, json=None):
        self.req = requests.delete(
            url=BASE_URL + api, 
            json=json,
            headers=self.header)
        return self
    
    def json(self):
        try:
            return self.req.json()
        except:
            if self.req.status_code != 200:
                raise Exception("Status code " + str(self.req.status_code) + "!")
            raise Exception("Exception while obtaining response json!")
            
def getApi(func):
    @wraps(func)
    def wrapped_func(*args, **kwargs): 
        return func(*args, **kwargs, useAPI = UseAPI(BASE_URL, None))
    return wrapped_func

def login_as_marry(func):
    @wraps(func)
    def wrapped_func(*args, **kwargs):
        res = requests.post(url=BASE_URL + "/api/employee/login", 
                            json={"email":marry_account["employeeEmail"], 
                                  "password":marry_account["password"]})
        api = UseAPI(BASE_URL, {'Authorization': "Bearer " + res.json()["token"]})
        return (func(*args, **kwargs, 
                     useAPI = api))
    return wrapped_func

def login_as_junior_keeper(func):
    @wraps(func)
    def wrapped_func(*args, **kwargs):
        res = requests.post(url=BASE_URL + "/api/employee/login", 
                            json={"email":junior_keeper["employeeEmail"], 
                                  "password":junior_keeper["password"]})
        return (func(*args, **kwargs, 
                     useAPI = UseAPI(BASE_URL, {'Authorization': "Bearer " + res.json()["token"]})))
    return wrapped_func


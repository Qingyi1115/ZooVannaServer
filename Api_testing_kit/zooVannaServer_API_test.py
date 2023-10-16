env = dict(map(lambda x:(x.strip().split("=")[0].strip(), x.strip().split("=")[1].strip()), map(lambda x:x.split("#")[0] if "=" in x.split("#")[0] else "None=None", open("./.env", "r").read().strip().split("\n"))))
SERVER_URL = env["SERVER_URL"]
SERVER_PORT = env["SERVER_PORT"]
BASE_URL = SERVER_URL + ":" + SERVER_PORT
STORE = dict()

from Employee_test import LOGIN_API_TESTS, USERS_API_TESTS

def do_tests(test_list):
    for tests in test_list:
        try:
            print("Testing ", tests[0].__name__)
            tests[0](*tests[1:])
        except Exception as e:
            print("Exception while calling ", tests[0].__name__) 
            print("Exception: ", e, "\n")
            import traceback
            traceback.print_exc()

def test_api():
    print("-----------Login APIs initiating-----------\n")
    do_tests(LOGIN_API_TESTS)
    print("Login APIs test finish")

    
    print("-----------User APIs initiating-----------\n")
    do_tests(USERS_API_TESTS)
    print("User APIs test finish")

if __name__ == "__main__":
    test_api()
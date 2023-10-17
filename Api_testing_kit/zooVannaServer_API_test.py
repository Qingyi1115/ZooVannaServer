env = dict(map(lambda x:(x.strip().split("=")[0].strip(), x.strip().split("=")[1].strip()), map(lambda x:x.split("#")[0] if "=" in x.split("#")[0] else "None=None", open("./.env", "r").read().strip().split("\n"))))
SERVER_URL = env["SERVER_URL"]
SERVER_PORT = env["SERVER_PORT"]
BASE_URL = SERVER_URL + ":" + SERVER_PORT
STORE = dict()

from Employee_test import LOGIN_API_TESTS, USERS_API_TESTS
from Animal_test import ANIMAL_ACTIVITY_LOG_API_TESTS, ANIMAL_ACTIVITY_API_TESTS

def do_tests(test_list):
    for tests in test_list:
        try:
            print("Testing ", tests[0].__name__)
            tests[0](*tests[1:])
            print("Testing ", tests[0].__name__, " success!\n")
        except Exception as e:
            print("Exception while calling ", tests[0].__name__) 
            print("Details: ", e, "\n")
            # import traceback
            # traceback.print_exc()

def test_api():
    print("-----------LOGIN_API_TESTS initiating-----------")
    do_tests(LOGIN_API_TESTS)
    print("-----------Group test finish!-------------------\n")

    
    print("-----------USERS_API_TESTS initiating-----------")
    do_tests(USERS_API_TESTS)
    print("-----------Group test finish!-------------------\n")

    
    print("-----------ANIMAL_ACTIVITY_LOG_API_TESTS initiating-----------")
    do_tests(ANIMAL_ACTIVITY_LOG_API_TESTS)
    print("-----------Group test finish!---------------------\n")

    
    print("-----------ANIMAL_ACTIVITY_API_TESTS initiating-----------")
    do_tests(ANIMAL_ACTIVITY_API_TESTS)
    print("-----------Group test finish!---------------------\n")

    

    

if __name__ == "__main__":
    test_api()
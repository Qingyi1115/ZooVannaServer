env = dict(map(lambda x:(x.strip().split("=")[0].strip(), x.strip().split("=")[1].strip()), map(lambda x:x.split("#")[0] if "=" in x.split("#")[0] else "None=None", open("./.env", "r").read().strip().split("\n"))))
SERVER_URL = env["SERVER_URL"]
SERVER_PORT = env["SERVER_PORT"]
BASE_URL = SERVER_URL + ":" + SERVER_PORT
STORE = dict()

from Employee_test import LOGIN_API_TESTS, USERS_API_TESTS
from Animal_test import ANIMAL_ACTIVITY_LOG_API_TESTS, ANIMAL_ACTIVITY_API_TESTS
from functools import reduce

def do_tests(test_list):
    cases = 0
    passes = 0
    fail_cases = []
    for tests in test_list:
        cases += 1
        try:
            tests[0](*tests[1:])
            print("Testing ", tests[0].__name__, " success!")
            passes += 1
        except Exception as e:
            print("Exception while calling ", tests[0].__name__) 
            fail_cases.append(tests[0].__name__)
            print("Details: ", e, "\n")
            import traceback
            traceback.print_exc()
    print("Group test cases pass : ", passes,"/", cases, ", successes rate ", round(passes/cases * 100, 2), "%")
    return cases, passes, fail_cases

def test_api():
    total_cases = 0
    total_passes = 0
    all_fails = []
    print("-----------LOGIN_API_TESTS initiating-----------")
    cases, passes, fail_cases = do_tests(LOGIN_API_TESTS)
    total_cases += cases
    total_passes += passes
    all_fails.extend(fail_cases)
    print("-----------Group test finish!-------------------\n")

    
    print("-----------USERS_API_TESTS initiating-----------")
    cases, passes, fail_cases = do_tests(USERS_API_TESTS)
    total_cases += cases
    total_passes += passes
    all_fails.extend(fail_cases)
    print("-----------Group test finish!-------------------\n")

    
    print("-----------ANIMAL_ACTIVITY_LOG_API_TESTS initiating-----------")
    cases, passes, fail_cases = do_tests(ANIMAL_ACTIVITY_LOG_API_TESTS)
    total_cases += cases
    total_passes += passes
    all_fails.extend(fail_cases)
    print("-----------Group test finish!---------------------\n")

    
    print("-----------ANIMAL_ACTIVITY_API_TESTS initiating-----------")
    cases, passes, fail_cases = do_tests(ANIMAL_ACTIVITY_API_TESTS)
    total_cases += cases
    total_passes += passes
    all_fails.extend(fail_cases)
    print("-----------Group test finish!---------------------\n")


    print("Total test cases pass : ", total_cases,"/", total_passes, ", successes rate ", round(total_cases/total_passes * 100, 2), "%\n")
    if len(all_fails):
        print("Failed test cases: ", ", ".join(all_fails))

    

    

if __name__ == "__main__":
    test_api()
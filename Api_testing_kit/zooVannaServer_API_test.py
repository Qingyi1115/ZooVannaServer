env = dict(map(lambda x:(x.strip().split("=")[0].strip(), x.strip().split("=")[1].strip()), map(lambda x:x.split("#")[0] if "=" in x.split("#")[0] else "None=None", open("./.env", "r").read().strip().split("\n"))))
SERVER_URL = env["SERVER_URL"]
SERVER_PORT = env["SERVER_PORT"]
BASE_URL = SERVER_URL + ":" + SERVER_PORT
STORE = dict()

from Employee_test import LOGIN_API_TESTS, EMPLOYEE_API_TESTS
from Animal_test import ANIMAL_ACTIVITY_LOG_API_TESTS, ANIMAL_ACTIVITY_API_TESTS, ZOO_EVENTS_API_TESTS
from Asset_Facility_test import FACILITY_API_TESTS, FACILITY_LOG_API_TESTS, ASSET_API_TEST
from Customer_test import CUSTOMER_API_TESTS
from Species_test import SPECIES_API_TESTS
from Promotion_test import PROMOTION_API_TESTS

total_cases = 0
total_passes = 0
all_fails = []

def do_tests(test_list):
    global total_cases, total_passes, all_fails
    cases = passes = 0
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
            # import traceback
            # traceback.print_exc()
    print("Group test cases pass : ", passes,"/", cases, ", Pass percentage ", round(passes/cases * 100, 2), "%")

    total_cases += cases
    total_passes += passes
    all_fails.extend(fail_cases)
    # return cases, passes, fail_cases

def test_api():
    print("-----------LOGIN_API_TESTS initiating-----------")
    do_tests(LOGIN_API_TESTS)
    print("-----------Group test finish!-------------------\n")
    
    print("-----------EMPLOYEE_API_TESTS initiating-----------")
    do_tests(EMPLOYEE_API_TESTS)
    print("-----------Group test finish!-------------------\n")
    
    print("-----------CUSTOMER_API_TESTS initiating-----------")
    do_tests(CUSTOMER_API_TESTS)
    print("-----------Group test finish!-------------------\n")
    
    print("-----------PROMOTION_API_TESTS initiating-----------")
    do_tests(PROMOTION_API_TESTS)
    print("-----------Group test finish!---------------------\n")

    print("-----------ANIMAL_ACTIVITY_LOG_API_TESTS initiating-----------")
    do_tests(ANIMAL_ACTIVITY_LOG_API_TESTS)
    print("-----------Group test finish!---------------------\n")
    
    print("-----------ANIMAL_ACTIVITY_API_TESTS initiating-----------")
    do_tests(ANIMAL_ACTIVITY_API_TESTS)
    print("-----------Group test finish!---------------------\n")
    
    print("-----------FACILITY_API_TESTS initiating-----------")
    do_tests(FACILITY_API_TESTS)
    print("-----------Group test finish!---------------------\n")
        
    print("-----------FACILITY_LOG_API_TESTS initiating-----------")
    do_tests(FACILITY_LOG_API_TESTS)
    print("-----------Group test finish!---------------------\n")
        
    print("-----------ASSET_API_TEST initiating-----------")
    do_tests(ASSET_API_TEST)
    print("-----------Group test finish!---------------------\n")
    
    print("-----------ZOO_EVENTS_API_TESTS initiating-----------")
    do_tests(ZOO_EVENTS_API_TESTS)
    print("-----------Group test finish!---------------------\n")
    
    print("-----------SPECIES_API_TESTS initiating-----------")
    do_tests(SPECIES_API_TESTS)
    print("-----------Group test finish!---------------------\n")

    print("All test cases finished!\nTotal test cases pass : ", total_passes,"/", total_cases, ", Pass percentage ", round(total_passes/total_cases * 100, 2), "%\n")
    if len(all_fails):
        print("Failed test cases: ", ", ".join(all_fails))

if __name__ == "__main__":
    test_api()
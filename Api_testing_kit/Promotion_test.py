from Annotations import UseAPI
from JsonData import new_promotion
from Annotations import login_as_marry, getApi
import random, string

def generate_random_string():
  return ''.join(random.choice(string.ascii_lowercase) for _ in range(20))

@getApi
def getAllPublishedPromotions_success(useAPI: UseAPI):
    res = useAPI.get("/api/promotion/getAllPublishedPromotions")
    response_json = res.json()
    assert isinstance(response_json, list), response_json
    assert res.status_code() == 200, "Status code not 200!"

@getApi
def getAllActivePromotions_success(useAPI: UseAPI):
    res = useAPI.get("/api/promotion/getAllActivePromotions")
    response_json = res.json()
    assert isinstance(response_json, list), response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def createPromotion_fail(promotion_dat, useAPI: UseAPI):
    res = useAPI.post("/api/promotion/createPromotion", send_image=True)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def createPromotion_success(promotion_dat, useAPI: UseAPI):
    res = useAPI.post("/api/promotion/createPromotion", send_image=True)
    print("res",res)
    response_json = res.json()
    print("response_json",response_json)
    assert isinstance(response_json, list), response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def getAllPromotions_success(useAPI: UseAPI):
    res = useAPI.get("/api/promotion/getAllPromotions")
    response_json = res.json()
    assert isinstance(response_json, list), response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def getPromotion_fail(promotion_id, useAPI: UseAPI):
    res = useAPI.get("/api/promotion/getPromotion/{}".format("Fake-id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@getApi
def getPromotion_success(promotion_id, useAPI: UseAPI):
    res = useAPI.get("/api/promotion/getPromotion/{}".format(promotion_id))
    response_json = res.json()
    assert "title" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@getApi
def verifyPromotionCode_fail(promotionCode, useAPI: UseAPI):
    res = useAPI.put("/api/promotion/verifyPromotionCode/{}".format("Fake-code"),
                     json={
                         "currentSpending" : 123
                     })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@getApi
def verifyPromotionCode_success(promotionCode, useAPI: UseAPI):
    res = useAPI.put("/api/promotion/verifyPromotionCode/{}".format(promotionCode),
                     json={
                         "currentSpending" : 123
                     })
    response_json = res.json()
    assert "title" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@getApi
def cancelUsePromotionCode_fail(promotionCode, useAPI: UseAPI):
    res = useAPI.put("/api/promotion/cancelUsePromotionCode/{}".format("Fake-code"),
                     json={
                         "currentSpending" : 123
                     })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@getApi
def cancelUsePromotionCode_success(promotionCode, useAPI: UseAPI):
    res = useAPI.put("/api/promotion/cancelUsePromotionCode/{}".format(promotionCode),
                     json={
                         "currentSpending" : 123
                     })
    response_json = res.json()
    assert isinstance(response_json, bool), response_json
    assert res.status_code() == 200, "Status code not 200!"

@getApi
def deletePromotion_fail(promotionId, useAPI: UseAPI):
    res = useAPI.delete("/api/promotion/deletePromotion/{}".format("Fake-code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@getApi
def deletePromotion_success(promotionId, useAPI: UseAPI):
    res = useAPI.delete("/api/promotion/deletePromotion/{}".format(promotionId))
    response_json = res.json()
    assert isinstance(response_json, bool), response_json
    assert res.status_code() == 200, "Status code not 200!"

PROMOTION_API_TESTS = [
    (getAllPublishedPromotions_success, ),
    (getAllActivePromotions_success, ),
    # (createPromotion_fail, new_promotion),
    # (createPromotion_success, new_promotion),
    (getAllPromotions_success, ),
    (getPromotion_fail, 1),
    (getPromotion_success, 1),
    (verifyPromotionCode_fail, 'BYELALA'),
    (verifyPromotionCode_success, 'BYELALA'),
    (cancelUsePromotionCode_fail, 'BYELALA'),
    (cancelUsePromotionCode_success, 'BYELALA'),
    # (updatePromotion_fail ,),
    # (updatePromotion_success ,),
    # (deletePromotion_fail, 1),
    # (deletePromotion_success, 1),
]
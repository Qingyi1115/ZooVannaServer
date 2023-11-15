from Annotations import UseAPI
from JsonData import new_species, new_species2,  new_physiological_reference_norms, new_diet_need
from Annotations import login_as_marry, login_as_junior_keeper
import random, string

def generate_random_string():
  return ''.join(random.choice(string.ascii_lowercase) for _ in range(20))


@login_as_junior_keeper
def getAllSpecies_success(useAPI: UseAPI):
    res = useAPI.get("/api/species/getAllSpecies")
    response_json = res.json()
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def createNewSpecies_fail(species_dat, useAPI: UseAPI):
    res = useAPI.post("/api/species/createNewSpecies",
                      json={"no data":"still no data"})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def createNewSpecies_success(species_dat, useAPI: UseAPI):
    res = useAPI.post("/api/species/createNewSpecies",
                      json=species_dat,
                      )
    response_json = res.json()
    assert "species" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"
    print("response_json",response_json)
    species_dat["speciesId"] = response_json["species"]["speciesId"]
    species_dat["speciesCode"] = response_json["species"]["speciesCode"]
    
@login_as_marry
def getSpecies_fail(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getSpecies/{}".format("fake-code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getSpecies_success(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getSpecies/{}".format(speciesCode))
    response_json = res.json()
    assert "commonName" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def updateSpecies_fail(species_dat, speciesCode, useAPI: UseAPI):
    if "speciesCode" in species_dat: del species_dat["speciesCode"]
    res = useAPI.put("/api/species/updateSpecies",
                     json=species_dat)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def updateSpecies_success(species_dat, speciesCode, useAPI: UseAPI):
    species_dat["speciesCode"] = speciesCode
    res = useAPI.put("/api/species/updateSpecies",
                     json=species_dat)
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def deleteSpecies_fail(speciesData, useAPI: UseAPI):
    res = useAPI.delete("/api/species/deleteSpecies/{}".format("Fake code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def deleteSpecies_success(speciesData, useAPI: UseAPI):
    res = useAPI.delete("/api/species/deleteSpecies/{}".format(speciesData["speciesCode"]))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def updateSpeciesEdu_fail(speciesCode, useAPI: UseAPI):
    res = useAPI.put("/api/species/updateSpeciesEdu",
                     json={
                         "speciesCode":None,
                         "educationalDescription":"New Desc",
                         "educationalFunFact":"New Fun Fact",
                     })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def updateSpeciesEdu_success(speciesCode, useAPI: UseAPI):
    res = useAPI.put("/api/species/updateSpeciesEdu",
                     json={
                         "speciesCode":speciesCode,
                         "educationalDescription":"New Desc",
                         "educationalFunFact":"New Fun Fact",
                     })
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def getSpeciesEduDescBySpeciesCode_fail(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getSpeciesEduDescBySpeciesCode/{}".format("fake code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getSpeciesEduDescBySpeciesCode_success(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getSpeciesEduDescBySpeciesCode/{}".format(speciesCode))
    response_json = res.json()
    assert "educationalDescription" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def updateSpeciesFoodRemark_fail(speciesCode, useAPI: UseAPI):
    res = useAPI.put("/api/species/updateSpeciesFoodRemark",
                     json={
                         "speciesCode" : "fake code",
                         "foodRemark" : "New Food Remark!"
                     })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def updateSpeciesFoodRemark_success(speciesCode, useAPI: UseAPI):
    res = useAPI.put("/api/species/updateSpeciesFoodRemark",
                     json={
                         "speciesCode" : speciesCode,
                         "foodRemark" : "New Food Remark!"
                     })
    response_json = res.json()
    assert "speciesFoodRemark" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def getSpeciesFoodRemarkBySpeciesCode_fail(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getSpeciesFoodRemarkBySpeciesCode/{}".format("fake code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getSpeciesFoodRemarkBySpeciesCode_success(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getSpeciesFoodRemarkBySpeciesCode/{}".format(speciesCode))
    response_json = res.json()
    assert "foodRemark" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def getAllPhysiologicalReferenceNormsByCode_fail(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getAllPhysiologicalReferenceNormsByCode/{}".format("fake code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getAllPhysiologicalReferenceNormsByCode_success(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getAllPhysiologicalReferenceNormsByCode/{}".format(speciesCode))
    response_json = res.json()
    assert isinstance(response_json, list), response_json
    assert res.status_code() == 200, "Status code not 200!"

@login_as_marry
def getPhysiologicalReferenceNormsById_fail(physiologicalRefId, useAPI: UseAPI):
    res = useAPI.get("/api/species/getPhysiologicalReferenceNormsById/{}".format("fake code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getPhysiologicalReferenceNormsById_success(physiologicalRefId, useAPI: UseAPI):
    res = useAPI.get("/api/species/getPhysiologicalReferenceNormsById/{}".format(physiologicalRefId))
    response_json = res.json()
    assert "minSizeMaleCm" in response_json, response_json
    assert "maxSizeMaleCm" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 

@login_as_marry
def createPhysiologicalReferenceNorms_fail(physiologicalReferenceNorms_dat, speciesCode, useAPI: UseAPI):
    if "speciesCode" in physiologicalReferenceNorms_dat : del physiologicalReferenceNorms_dat["speciesCode"]
    res = useAPI.post("/api/species/createPhysiologicalReferenceNorms",
                      json=physiologicalReferenceNorms_dat)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def createPhysiologicalReferenceNorms_success(physiologicalReferenceNorms_dat, speciesCode, useAPI: UseAPI):
    physiologicalReferenceNorms_dat["speciesCode"] = speciesCode
    res = useAPI.post("/api/species/createPhysiologicalReferenceNorms",
                      json=physiologicalReferenceNorms_dat)
    response_json = res.json()
    assert "physiologicalRefNorms" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 
    new_physiological_reference_norms["physiologicalRefId"] = response_json["physiologicalRefNorms"]["physiologicalRefId"]

@login_as_marry
def updatePhysiologicalReferenceNorms_fail(physiologicalReferenceNorms_dat, useAPI: UseAPI):
    if "physiologicalRefId" in physiologicalReferenceNorms_dat : 
        id = physiologicalReferenceNorms_dat["physiologicalRefId"]
        del physiologicalReferenceNorms_dat["physiologicalRefId"]
    res = useAPI.put("/api/species/updatePhysiologicalReferenceNorms",
                      json=physiologicalReferenceNorms_dat)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"
    physiologicalReferenceNorms_dat["physiologicalRefId"] = id

@login_as_marry
def updatePhysiologicalReferenceNorms_success(physiologicalReferenceNorms_dat, useAPI: UseAPI):
    res = useAPI.put("/api/species/updatePhysiologicalReferenceNorms",
                      json=physiologicalReferenceNorms_dat)
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def deletePhysiologicalReferenceNorms_fail(physiologicalReferenceNorms_dat, useAPI: UseAPI):
    res = useAPI.delete("/api/species/deletePhysiologicalReferenceNorms/{}".format("fake-code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def deletePhysiologicalReferenceNorms_success(physiologicalReferenceNorms_dat, useAPI: UseAPI):
    res = useAPI.delete("/api/species/deletePhysiologicalReferenceNorms/{}".format(physiologicalReferenceNorms_dat["physiologicalRefId"]))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def getAllDietNeedbySpeciesCode_fail(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getAllDietNeedbySpeciesCode/{}".format("fake-code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getAllDietNeedbySpeciesCode_success(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getAllDietNeedbySpeciesCode/{}".format(speciesCode))
    response_json = res.json()
    assert isinstance(response_json, list) , response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def createDietNeed_fail(diet_need_dat, speciesCode, useAPI: UseAPI):
    if "speciesCode" in diet_need_dat :
        del diet_need_dat["speciesCode"]
    res = useAPI.post("/api/species/createDietNeed",
                      json=diet_need_dat)
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def createDietNeed_success(diet_need_dat, speciesCode, useAPI: UseAPI):
    diet_need_dat["speciesCode"] = speciesCode
    res = useAPI.post("/api/species/createDietNeed",
                      json=diet_need_dat)
    response_json = res.json()
    assert "dietNeed" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 
    diet_need_dat["speciesDietNeedId"] = response_json["dietNeed"]["speciesDietNeedId"]
    
@login_as_marry
def getDietNeedById_fail(diet_need_dat, useAPI: UseAPI):
    res = useAPI.get("/api/species/getDietNeedById/{}".format("fake-code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getDietNeedById_success(diet_need_dat, useAPI: UseAPI):
    res = useAPI.get("/api/species/getDietNeedById/{}".format(diet_need_dat["speciesDietNeedId"]))
    response_json = res.json()
    assert "animalFeedCategory" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def updateDietNeed_fail(diet_need_dat, useAPI: UseAPI):
    res = useAPI.put("/api/species/updateDietNeed",
                     json={"missing data":"data missing"})
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def updateDietNeed_success(diet_need_dat, useAPI: UseAPI):
    res = useAPI.put("/api/species/updateDietNeed",
                     json=diet_need_dat)
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def deleteDietNeed_fail(diet_need_dat, useAPI: UseAPI):
    res = useAPI.delete("/api/species/deleteDietNeed/{}".format("fake-id"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def deleteDietNeed_success(diet_need_dat, useAPI: UseAPI):
    res = useAPI.delete("/api/species/deleteDietNeed/{}".format(diet_need_dat["speciesDietNeedId"]))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def getAllCompatibilitiesbySpeciesCode_fail(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getAllCompatibilitiesbySpeciesCode/{}".format("fake-code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getAllCompatibilitiesbySpeciesCode_success(speciesCode, useAPI: UseAPI):
    res = useAPI.get("/api/species/getAllCompatibilitiesbySpeciesCode/{}".format(speciesCode))
    response_json = res.json()
    assert isinstance(response_json, list), response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def getCompatibility_fail(speciesCode1, speciesCode2, useAPI: UseAPI):
    res = useAPI.get("/api/species/getCompatibility/{}/{}".format("fake-code", "another-fake-code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def getCompatibility_success(speciesCode1, speciesCode2, useAPI: UseAPI):
    res = useAPI.get("/api/species/getCompatibility/{}/{}".format(speciesCode1, speciesCode2))
    response_json = res.json()
    assert isinstance(response_json, bool), response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def deleteCompatibility_fail(speciesCode1, speciesCode2, useAPI: UseAPI):
    res = useAPI.delete("/api/species/deleteCompatibility/{}/{}".format("fake-code", "another-fake-code"))
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def deleteCompatibility_success(speciesCode1, speciesCode2, useAPI: UseAPI):
    res = useAPI.delete("/api/species/deleteCompatibility/{}/{}".format(speciesCode1, speciesCode2))
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 
    
@login_as_marry
def createCompatibility_fail(speciesCode1, speciesCode2, useAPI: UseAPI):
    res = useAPI.post("/api/species/createCompatibility",
                      json={
                          "speciesCode1":"fake-code",
                          "speciesCode2":"another-fake-code",
                        })
    response_json = res.json()
    assert "error" in response_json, response_json
    assert res.status_code() == 400, "Status code not 400!"

@login_as_marry
def createCompatibility_success(speciesCode1, speciesCode2, useAPI: UseAPI):
    res = useAPI.post("/api/species/createCompatibility",
                      json={
            "speciesCode1":speciesCode1,
            "speciesCode2":speciesCode2,
        })
    response_json = res.json()
    assert "result" in response_json, response_json
    assert res.status_code() == 200, "Status code not 200!" 

SPECIES_API_TESTS = [
    (getAllSpecies_success, ),
    # (createNewSpecies_fail, new_species),
    # (createNewSpecies_success, new_species),
    (getSpecies_fail, "SPE003"),
    (getSpecies_success, "SPE003"),
    (updateSpecies_fail, new_species2, "SPE003"),
    (updateSpecies_success, new_species2, "SPE003"),
    # (deleteSpecies_fail, new_species,),
    # (deleteSpecies_success, new_species,),
    (updateSpeciesEdu_fail, "SPE003"),
    (updateSpeciesEdu_success, "SPE003"),
    (getSpeciesEduDescBySpeciesCode_fail, "SPE003"),
    (getSpeciesEduDescBySpeciesCode_success, "SPE003"),
    (updateSpeciesFoodRemark_fail, "SPE003"),
    (updateSpeciesFoodRemark_success, "SPE003"),
    (getSpeciesFoodRemarkBySpeciesCode_fail, "SPE003"),
    (getSpeciesFoodRemarkBySpeciesCode_success, "SPE003"),
    (getAllPhysiologicalReferenceNormsByCode_fail, "SPE003"),
    (getAllPhysiologicalReferenceNormsByCode_success, "SPE003"),
    (getPhysiologicalReferenceNormsById_fail, "1"),
    (getPhysiologicalReferenceNormsById_success, "1"),
    (createPhysiologicalReferenceNorms_fail, new_physiological_reference_norms,"SPE003"),
    (createPhysiologicalReferenceNorms_success, new_physiological_reference_norms,"SPE003"),
    (updatePhysiologicalReferenceNorms_fail, new_physiological_reference_norms),
    (updatePhysiologicalReferenceNorms_success, new_physiological_reference_norms),
    (deletePhysiologicalReferenceNorms_fail, new_physiological_reference_norms),
    (deletePhysiologicalReferenceNorms_success, new_physiological_reference_norms),
    (getAllDietNeedbySpeciesCode_fail, "SPE003"),
    (getAllDietNeedbySpeciesCode_success, "SPE003"),
    (createDietNeed_fail, new_diet_need, "SPE003"),
    (createDietNeed_success, new_diet_need, "SPE003"),
    (getDietNeedById_fail, new_diet_need),
    (getDietNeedById_success, new_diet_need),
    (updateDietNeed_fail, new_diet_need),
    (updateDietNeed_success, new_diet_need),
    (deleteDietNeed_fail, new_diet_need),
    (deleteDietNeed_success, new_diet_need),
    (getAllCompatibilitiesbySpeciesCode_fail, "SPE003"),
    (getAllCompatibilitiesbySpeciesCode_success, "SPE003"),
    (getCompatibility_fail, "SPE001", "SPE002"),
    (getCompatibility_success, "SPE001", "SPE002"),
    (deleteCompatibility_fail, "SPE002", "SPE003"),
    (deleteCompatibility_success, "SPE002", "SPE003"),
    (createCompatibility_fail, "SPE002", "SPE003"),
    (createCompatibility_success, "SPE002", "SPE003"),
]
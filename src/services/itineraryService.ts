import { Facility } from "../models/Facility";
import { Enclosure } from "../models/Enclosure";
import { Species } from "../models/Species";
import { Itinerary } from "../models/Itinerary";
import { Customer } from "../models/Customer";
import { ItineraryItem } from "../models/ItineraryItem";

export async function optimizeItineraryRoute(nodes: Species[]) {
  try {
    let minDistance = Infinity;
    let firstNode = 0;
    const visited = new Set();
    for (let i = 0; i < nodes.length; i++) {
      const dist = calculateDistance(
        103.7817,
        1.291,
        (
          await (
            await (await nodes[i].getAnimals())[0].getEnclosure()
          ).getFacility()
        ).xCoordinate,
        (
          await (
            await (await nodes[i].getAnimals())[0].getEnclosure()
          ).getFacility()
        ).yCoordinate,
      );

      if (dist < minDistance) {
        minDistance = dist;
        firstNode = i;
      }
    }

    const path: number[] = [firstNode];
    visited.add(firstNode);

    while (visited.size < nodes.length) {
      let minDistance = Infinity;
      let nextNode = null;

      for (let i = 0; i < nodes.length; i++) {
        const currentNode: number = path[path.length - 1];
        if (!visited.has(i) && i !== currentNode) {
          const dist = calculateDistance(
            (
              await (
                await (await nodes[i].getAnimals())[0].getEnclosure()
              ).getFacility()
            ).xCoordinate,
            (
              await (
                await (await nodes[i].getAnimals())[0].getEnclosure()
              ).getFacility()
            ).yCoordinate,
            (
              await (
                await (await nodes[currentNode].getAnimals())[0].getEnclosure()
              ).getFacility()
            ).xCoordinate,
            (
              await (
                await (await nodes[currentNode].getAnimals())[0].getEnclosure()
              ).getFacility()
            ).yCoordinate,
          );
          if (dist < minDistance) {
            minDistance = dist;
            nextNode = i;
          }
        }
      }

      if (nextNode !== null) {
        path.push(nextNode);
        console.log("this is " + path);
        visited.add(nextNode);
      }
    }

    let result: Facility[] = [];

    for (const _path of path) {
      result.push(
        await (
          await (await nodes[_path].getAnimals())[0].getEnclosure()
        ).getFacility(),
      );
    }

    console.log("then the result is " + result);
    // Return to the starting node
    return result;
  } catch (error: any) {
    throw { error: error.message };
  }
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export async function createItinerary(
  customer: Customer,
  itineraryName: string,
  datePlannedVisit: Date,
  facilities: Facility[],
  specieses: Species[],
) {
  try {
    const data = {
      itineraryName,
      datePlannedVisit,
    };
    const itinerary = await Itinerary.create(data);
    let i = 0;
    for (const facility of facilities) {
      const itineraryItem = await ItineraryItem.create({ orderNum: i });

      await itineraryItem.setItinerary(itinerary);
      await itineraryItem.setFacility(facility);

      i++;
    }

    await itinerary.setSpecieses(specieses);
    specieses.map((species) => species.addItinerary(itinerary));

    await customer.addItinerary(itinerary);
    await itinerary.setCustomer(customer);

    console.log("until here");
    console.log(itinerary);

    return itinerary;
  } catch (error: any) {
    throw { error: error.message };
  }
}

export async function getItineraryById(itineraryId: number) {
  try {
    const itinerary = await Itinerary.findOne({
      where: { itineraryId: itineraryId },
      include: ["specieses"],
    });

    if (itinerary) {
      return itinerary;
    } else {
      throw new Error("Itinerary does not exist!");
    }
  } catch (error: any) {
    throw { error: error.message };
  }
}

export async function getFacilitiesInOrder(itineraryId: number) {
  try {
    const itinerary = await Itinerary.findOne({
      where: { itineraryId: itineraryId }, // Log the generated SQL query to the console
    });

    console.log(itinerary);

    if (itinerary) {
      console.log("here is ");
      console.log(itinerary.itineraryItems);
      const itineraryItems = (await itinerary.getItineraryItems()).sort(
        (a, b) => a.orderNum - b.orderNum,
      );

      console.log("itineraryItems");

      console.log(itineraryItems);

      const facilityData: Facility[] = [];

      if (itineraryItems) {
        for (const itineraryItem of itineraryItems) {
          facilityData.push(await itineraryItem.getFacility());
        }
      }

      return facilityData;
    } else {
      throw new Error("Itinerary does not exist!");
    }
  } catch (error: any) {
    throw { error: error.message };
  }
}

export async function removeItineraryById(itineraryId: number) {
  try {
    const itinerary = await Itinerary.findOne({
      where: { itineraryId: itineraryId },
      include: ["specieses"],
    });

    if (itinerary) {
      const itineraryItems = await itinerary.getItineraryItems();
      for (const itineraryItem of itineraryItems) {
        await (
          await itineraryItem.getFacility()
        ).removeItineraryItem(itineraryItem);
        await itinerary.removeItineraryItem(itineraryItem);
        itineraryItem.destroy();
      }

      const specieses = await itinerary.getSpecieses();
      for (const species of specieses) {
        await species.removeItinerary(itinerary);
      }
      itinerary.destroy();
    } else {
      throw new Error("Itinerary does not exist!");
    }
  } catch (error: any) {
    throw { error: error.message };
  }
}

export async function editItinerary(
  itineraryName: string,
  datePlannedVisit: Date,
  itinerary: Itinerary,
  facilities: Facility[],
  specieses: Species[],
) {
  try {
    itinerary.setItineraryName(itineraryName);
    itinerary.setDatePlannedVisit(datePlannedVisit);

    const itineraryItems = await itinerary.getItineraryItems();
    for (const itineraryItem of itineraryItems) {
      await (
        await itineraryItem.getFacility()
      ).removeItineraryItem(itineraryItem);
      await itinerary.removeItineraryItem(itineraryItem);
      itineraryItem.destroy();
    }

    let i = 0;
    console.log(facilities);
    for (const facility of facilities) {
      const itineraryItem = await ItineraryItem.create({ orderNum: i });
      console.log(itineraryItem);
      itineraryItem.setItinerary(itinerary);
      await itineraryItem.setFacility(facility);
      i++;
    }
    const speciesData = await itinerary.getSpecieses();

    console.log(facilities);

    for (const species of speciesData) {
      await species.removeItinerary(itinerary);
    }

    itinerary.setSpecieses(specieses);

    console.log("here");

    return itinerary;
  } catch (error: any) {
    throw { error: error.message };
  }
}

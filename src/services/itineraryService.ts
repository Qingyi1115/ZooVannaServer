import { Facility } from "models/Facility";
import { Enclosure } from "../models/Enclosure";
import { Species } from "../models/Species";

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

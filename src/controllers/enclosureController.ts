import { Request, Response } from "express";
import * as SpeciesService from "../services/species";
import * as AnimalService from "../services/animal";
import * as EnclosureService from "../services/enclosure";
import { handleFileUpload } from "../helpers/multerProcessFile";

export async function getAllEnclosures(req: Request, res: Response) {
  try {
    const allEnclosures = await EnclosureService.getAllEnclosures();
    return res.status(200).json(allEnclosures);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnclosuresById(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosure = await EnclosureService.getEnclosuresById(
      Number(enclosureId),
    );
    return res.status(200).json(enclosure);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function createNewEnclosure(req: Request, res: Response) {
  try {
    // const imageUrl = await handleFileUpload(
    //   req,
    //   process.env.IMG_URL_ROOT! + "species", //"D:/capstoneUploads/species",
    // );
    const { facilityId, name, remark, length, width, height, enclosureStatus } =
      req.body;

    if (
      [
        facilityId,
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        facilityId,
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.createNewEnclosure(
      facilityId,
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnclosure(req: Request, res: Response) {
  try {
    // let imageUrl;
    // if (
    //   req.headers["content-type"] &&
    //   req.headers["content-type"].includes("multipart/form-data")
    // ) {
    //   imageUrl = await handleFileUpload(
    //     req,
    //     process.env.IMG_URL_ROOT! + "facility",
    //   );
    // } else {
    //   imageUrl = req.body.imageUrl;
    // }
    const {
      enclosureId,
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
    } = req.body;

    if (
      [
        enclosureId,
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        enclosureId,
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.updateEnclosure(
      enclosureId,
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateEnclosureStatus(req: Request, res: Response) {
  try {
    const { enclosureId, enclosureStatus } = req.body;

    if ([enclosureId, enclosureStatus].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        enclosureStatus,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.updateEnclosureStatus(
      Number(enclosureId),
      enclosureStatus,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEnclosure(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosure = await EnclosureService.deleteEnclosure(
      Number(enclosureId),
    );
    return res.status(200).json(enclosure);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//assignAnimalToEnclosure
export async function assignAnimalToEnclosure(req: Request, res: Response) {
  try {
    const { enclosureId, animalCode } = req.body;

    if ([enclosureId, animalCode].includes(undefined)) {
      console.log("Missing field(s): ", {
        enclosureId,
        animalCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.assignAnimalToEnclosure(
      Number(enclosureId),
      animalCode,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

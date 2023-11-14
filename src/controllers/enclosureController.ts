import { Request, Response } from "express";
import * as EnclosureService from "../services/enclosureService";

export async function getAllEnclosures(req: Request, res: Response) {
  try {
    const allEnclosures = await EnclosureService.getAllEnclosures();
    return res.status(200).json(allEnclosures);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getEnclosureById(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const enclosure = await EnclosureService.getEnclosureById(
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
    const {
      facilityId,
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
      facilityName,
      xCoordinate,
      yCoordinate,
      isSheltered,
      facilityDetail,
      facilityDetailJson,
      imageUrl,
    } = req.body;

    if (
      [
        facilityId,
        name,
        remark,
        length,
        width,
        height,
        enclosureStatus,
        facilityName,
        xCoordinate,
        yCoordinate,
        isSheltered,
        facilityDetail,
        facilityDetailJson,
        imageUrl,
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
        facilityName,
        xCoordinate,
        yCoordinate,
        isSheltered,
        facilityDetail,
        facilityDetailJson,
        imageUrl,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let enclosure = await EnclosureService.createNewEnclosure(
      name,
      remark,
      length,
      width,
      height,
      enclosureStatus,
      facilityName,
      xCoordinate,
      yCoordinate,
      isSheltered,
      facilityDetail,
      facilityDetailJson,
      imageUrl,
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

// /getanimalsofenclosure/:enclosureId
export async function getAnimalsOfEnclosure(req: Request, res: Response) {
  const { enclosureId } = req.params;

  if (enclosureId == undefined) {
    console.log("Missing field(s): ", {
      enclosureId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const animalsList = await EnclosureService.getAnimalsOfEnclosure(
      Number(enclosureId),
    );
    return res.status(200).json({ animalsList });
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

//removeAnimalFromEnclosure
export async function removeAnimalFromEnclosure(req: Request, res: Response) {
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
    let enclosure = await EnclosureService.removeAnimalFromEnclosure(
      Number(enclosureId),
      animalCode,
    );

    return res.status(200).json({ enclosure });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// getSpeciesCompatibilityInEnclosure
export async function getSpeciesCompatibilityInEnclosure(
  req: Request,
  res: Response,
) {
  try {
    const { speciesCode, enclosureId } = req.params;

    if (enclosureId == undefined || speciesCode == undefined) {
      console.log("Missing field(s): ", {
        enclosureId,
        speciesCode,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let isCompatible =
      await EnclosureService.getSpeciesCompatibilityInEnclosure(
        Number(enclosureId),
        speciesCode,
      );

    return res.status(200).json({ isCompatible });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateDesignDiagram(req: Request, res: Response) {
  try {
    const { enclosureId } = req.params;
    const { designDiagramJson } = req.body;
    if (enclosureId == undefined) {
      console.log("Missing field(s): ", {
        enclosureId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    if ([designDiagramJson].includes(undefined)) {
      console.log("Missing field(s): ", {
        designDiagramJson,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    await EnclosureService.updateDesignDiagram(
      Number(enclosureId),
      designDiagramJson,
    );

    return res.status(200).json("Successfully saved diagram!");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

import { Request, Response } from "express";
import * as AnnouncementService from "../services/announcementService";

export async function createAnnouncement(req: Request, res: Response) {
  try {
    console.log("in create announcement controller");

    const {
      title,
      content,
      isPublished,
      scheduledStartPublish,
      scheduledEndPublish,
    } = req.body;

    if (
      [
        title,
        content,
        isPublished,
        scheduledStartPublish,
        scheduledEndPublish,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        title,
        content,
        isPublished,
        scheduledStartPublish,
        scheduledEndPublish,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let announcement = await AnnouncementService.createNewAnnouncement(
      title,
      content,
      isPublished,
      scheduledStartPublish,
      scheduledEndPublish,
    );
    return res.status(200).json({ announcement });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllAnnouncements(req: Request, res: Response) {
  try {
    const allAnnouncements = await AnnouncementService.getAllAnnouncements();
    return res.status(200).json(allAnnouncements);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllPublishedAnnouncements(
  req: Request,
  res: Response,
) {
  try {
    const publishedAnnouncements =
      await AnnouncementService.getAllPublishedAnnouncements();
    return res.status(200).json(publishedAnnouncements);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAnnouncementByAnnouncementId(
  req: Request,
  res: Response,
) {
  const { announcementId } = req.params;

  if (announcementId == undefined) {
    console.log("Missing field(s): ", {
      announcementId,
    });
    return res.status(400).json({ error: "Missing announcement id!" });
  }

  try {
    const announcementIdInt = parseInt(announcementId);
    if (!isNaN(announcementIdInt)) {
      const announcement =
        await AnnouncementService.getAnnouncementByAnnouncementId(
          announcementIdInt,
        );
      return res.status(200).json(announcement);
    } else {
      return res.status(400).json({ error: "Invalid announcement ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAnnouncement(req: Request, res: Response) {
  const { announcementId } = req.params;

  if (announcementId == undefined) {
    console.log("Missing field(s): ", {
      announcementId,
    });
    return res.status(400).json({ error: "Missing announcement ID!" });
  }

  try {
    const announcementIdInt = parseInt(announcementId);
    if (!isNaN(announcementIdInt)) {
      const announcement =
        await AnnouncementService.deleteAnnouncement(announcementIdInt);
      return res.status(200).json(announcement);
    } else {
      return res.status(400).json({ error: "Invalid announcement ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAnnouncement(req: Request, res: Response) {
  try {
    const { announcementId } = req.params;

    if (announcementId == undefined) {
      console.log("Missing field(s): ", {
        announcementId,
      });
      return res.status(400).json({ error: "Missing announcement ID!" });
    }

    const {
      title,
      content,
      isPublished,
      scheduledStartPublish,
      scheduledEndPublish,
    } = req.body;

    if (
      [
        title,
        content,
        isPublished,
        scheduledStartPublish,
        scheduledEndPublish,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        title,
        content,
        isPublished,
        scheduledStartPublish,
        scheduledEndPublish,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    const announcementIdInt = parseInt(announcementId);
    if (!isNaN(announcementIdInt)) {
      let announcement = await AnnouncementService.updateAnnouncement(
        announcementIdInt,
        title,
        content,
        isPublished,
        scheduledStartPublish,
        scheduledEndPublish,
      );

      // console.log("publishDate: " + publishDate);
      // console.log("startDate: " + startDate);
      // console.log("endDate:" + endDate);

      return res.status(200).json({ announcement });
    } else {
      return res.status(400).json({ error: "Invalid announcement ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function togglePublishAnnouncement(req: Request, res: Response) {
  const { announcementId } = req.params;

  if (announcementId == undefined) {
    console.log("Missing field(s): ", {
      announcementId,
    });
    return res.status(400).json({ error: "Missing announcement ID!" });
  }

  try {
    const announcementIdInt = parseInt(announcementId);
    if (!isNaN(announcementIdInt)) {
      const announcement =
        await AnnouncementService.togglePublishAnnouncement(announcementIdInt);
      return res.status(200).json(announcement);
    } else {
      return res.status(400).json({ error: "Invalid announcement ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

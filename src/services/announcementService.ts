import { validationErrorHandler } from "../helpers/errorHandler";
import { Announcement } from "../models/Announcement";

export async function createNewAnnouncement(
  title: string,
  content: string,
  isPublished: boolean,
  scheduledStartPublish: Date,
  scheduledEndPublish: Date,
) {
  let newAnnouncement = {
    title: title,
    content: content,
    isPublished: isPublished,
    scheduledStartPublish: scheduledStartPublish,
    scheduledEndPublish: scheduledEndPublish,
  } as any;

  try {
    return await Announcement.create(newAnnouncement);
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllAnnouncements() {
  try {
    const allAnnouncement = await Announcement.findAll();
    return allAnnouncement;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllPublishedAnnouncements() {
  try {
    const allAnnouncement = await Announcement.findAll();
    const currentDate = new Date(new Date().toUTCString());
    const publishedAnnouncements = allAnnouncement.filter((announcement) => {
      return (
        announcement.isPublished &&
        announcement.scheduledStartPublish <= currentDate &&
        announcement.scheduledEndPublish >= currentDate
      );
    });
    return publishedAnnouncements;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAnnouncementByAnnouncementId(announcementId: number) {
  let result = await Announcement.findOne({
    where: { announcementId: announcementId },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid announcement ID!" };
}

export async function deleteAnnouncement(announcementId: number) {
  let result = await Announcement.destroy({
    where: { announcementId: announcementId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Announcement ID!");
}

export async function updateAnnouncement(
  announcementId: number,
  title: string,
  content: string,
  isPublished: boolean,
  scheduledStartPublish: Date,
  scheduledEndPublish: Date,
) {
  let updatedAnnouncement = {
    announcementId: announcementId,
    title: title,
    content: content,
    isPublished: isPublished,
    scheduledStartPublish: scheduledStartPublish,
    scheduledEndPublish: scheduledEndPublish,
  } as any;

  try {
    let announcement = await Announcement.update(updatedAnnouncement, {
      where: { announcementId: announcementId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function togglePublishAnnouncement(
  announcementId: number,
) {
  let announcement = await getAnnouncementByAnnouncementId(announcementId);

  let updatedAnnouncement = {
    announcementId: announcementId,
    title: announcement.title,
    content: announcement.content,
    isPublished: !announcement.isPublished,
    scheduledStartPublish: announcement.scheduledStartPublish,
    scheduledEndPublish: announcement.scheduledEndPublish,
  } as any;

  try {
    let announcement = await Announcement.update(updatedAnnouncement, {
      where: { announcementId: announcementId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

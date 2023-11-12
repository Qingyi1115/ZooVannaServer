import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
): void => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp"
    ) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const ensureDirectoryExists = (directory: string) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

const configureMulter = (destination: string) => {
    const fileStorage = multer.diskStorage({
        destination: (
            request: Request,
            file: Express.Multer.File,
            callback: DestinationCallback,
        ): void => {
            ensureDirectoryExists(destination);

            callback(null, destination);
        },

        filename: (
            req: Request,
            file: Express.Multer.File,
            callback: FileNameCallback,
        ): void => {
            callback(null, file.originalname);
        },
    });

    return multer({ storage: fileStorage, fileFilter: fileFilter }).single("file");
};

export const handleFileUpload = (
    req: Request,
    customDestination: string,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const processFile = configureMulter(customDestination);

        processFile(req, {} as any, (err: any) => {
            if (err) {
                reject(err);
            } else if (!req.file) {
                // reject(new Error("No file provided"));
                console.log("No image file")
                resolve("");
            } else {
                const { filename, path } = req.file;
                const targetPath = customDestination + "/" + filename;

                fs.rename(path, targetPath, (renameErr: any) => {
                    if (renameErr) {
                        reject(renameErr);
                    } else {
                        resolve(targetPath); // Return the file path
                    }
                });
            }
        });
    });
};

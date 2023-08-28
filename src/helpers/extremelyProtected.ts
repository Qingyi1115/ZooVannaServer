import crypto from "crypto";

export function hash(string:string) {
    return crypto.createHash('sha256').update(string).digest('hex');
}

export const secretKey = "qwerty-unbreakable";
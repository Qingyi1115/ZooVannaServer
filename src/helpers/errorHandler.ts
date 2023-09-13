import { ValidationError } from "Sequelize";

export function validationErrorHandler(error: any) {
  if (error instanceof ValidationError) {
    let msgs: string[] = [];
    error.errors.forEach((element) => {
      msgs.push(element.message);
    });
    return { message: msgs };
  }
  return error;
}

import { NextFunction, Request, Response } from "express"

export async function allErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    const message = error.message || "Something went wrong";

    console.log("Error Handling Middleware called")
    console.log('Path: ', req.path);
    console.log('Message: ', message);

    res.json({
        error: true,
        message
    })
}
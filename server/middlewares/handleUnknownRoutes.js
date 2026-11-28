export default function handleUnknownRoutes(req, res, next) {
    const err = new Error(`Route Error: Not Found - ${req.originalUrl}`);
    err.status = 404;
    next(err)
}
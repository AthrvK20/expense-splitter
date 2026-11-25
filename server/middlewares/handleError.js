export default function handleError(err, req, res, next) {
    if (err.type === 'entity.parse.failed') {
        console.error(err.name, err.message, err.type);
        return res.status(400).json({
            error: `${err.name}: ${err.message}`,
        });
    }

    console.error(err.name, err.message, err.type);
    return res.status(500).json({ error: `Error: Internal Server Error` });
}

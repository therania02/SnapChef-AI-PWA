export default class BaseController {
    // Method standar untuk mengirim respons sukses (Indikator: Format Seragam)
    sendSuccess(res, statusCode, message, data = null) {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data
        });
    }

    // Method standar untuk merespons error (Indikator: Error Handling Terpusat)
    sendError(res, statusCode, message) {
        return res.status(statusCode).json({
            success: false,
            message: message
        });
    }
}
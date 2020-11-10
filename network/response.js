exports.success = function(req, res, message, status) {
    res.status(status || 200).json({
        error: '',
        body: message
    });
}

exports.error = function(req, res, message, status, details) {
    console.error('[response error]' + details);
    res.status(status || 500).json({
        error: message,
        body: ''
    });
}
const requestReturnValue = {}
requestReturnValue.pipe = jest.fn().mockReturnValue(requestReturnValue)

export default jest.fn().mockImplementation(
    (opts, cb) => cb(null, { statusCode: 200 }, requestReturnValue))

let headers = {}
const gotMock = jest.fn()
    .mockImplementation(() => Promise.resolve({ statusCode: 200, headers }))
gotMock.get = gotMock
gotMock.put = gotMock
gotMock.post = gotMock
gotMock.extend = jest.fn().mockReturnValue(gotMock)
gotMock.setHeader = (header) => (headers = header)

export default gotMock

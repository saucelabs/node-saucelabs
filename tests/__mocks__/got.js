const gotMock = jest.fn()
    .mockReturnValue(Promise.resolve({ statusCode: 200, headers: {} }))
gotMock.get = gotMock
gotMock.put = gotMock
gotMock.extend = jest.fn().mockReturnValue(gotMock)

export default gotMock

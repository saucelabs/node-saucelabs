const instances = []
class BinWrapperMock {
    constructor () {
        this.run = jest.fn().mockReturnValue(Promise.resolve()),
        this.path = jest.fn().mockReturnValue('/foo/bar'),
        this.src = jest.fn()
        this.dest = jest.fn().mockReturnValue(this)
        this.use = jest.fn().mockReturnValue(this)
        this.version = jest.fn().mockReturnValue(this)
        instances.push(this)
    }
}

export default BinWrapperMock
export { instances }

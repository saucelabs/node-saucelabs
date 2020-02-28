export const instances = []

export default class FormData {
    constructor () {
        this.append = jest.fn()
        this.getHeaders = jest.fn().mockReturnValue({ some: 'headers' })
        this.pipe = jest.fn()
        instances.push(this)
    }
}

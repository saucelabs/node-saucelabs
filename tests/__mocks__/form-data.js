const instances = []

export default class FormDataMock {
    constructor () {
        this.append = jest.fn()
        this.instances = instances
        instances.push(this)
    }
}

const instances = [];

export default class FormDataMock {
  constructor() {
    this.append = jest.fn();
    this.getHeaders = jest.fn().mockReturnValue({
      'content-type': 'multipart/form-data; boundary=test-boundary',
    });
    this.instances = instances;
    instances.push(this);
  }
}

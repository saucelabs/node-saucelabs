const yargsMock = {}
yargsMock.usage = jest.fn().mockReturnValue(yargsMock)
yargsMock.epilog = jest.fn().mockReturnValue(yargsMock)
yargsMock.demandCommand = jest.fn().mockReturnValue(yargsMock)
yargsMock.help = jest.fn().mockReturnValue(yargsMock)
yargsMock.command = jest.fn().mockReturnValue(yargsMock)
yargsMock.option = jest.fn().mockReturnValue(yargsMock)
yargsMock.positional = jest.fn().mockReturnValue(yargsMock)
yargsMock.commandDir = jest.fn().mockReturnValue(yargsMock)
yargsMock.version = jest.fn().mockReturnValue(yargsMock)

export default yargsMock

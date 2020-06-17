import os from 'os'

const getLocalIPAddress = () => {
  const networkInterfaces = os.networkInterfaces()
  const myNetworkInterface = networkInterfaces.Ethernet[1]
  const myIPAddress = myNetworkInterface.address

  return myIPAddress
}

export default getLocalIPAddress

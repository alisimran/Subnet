function uploadvalues(){
  var ip = document.getElementById('IP');
  var CIDR_not = document.getElementById('CIDR');
  var cidr = CIDR_not.value.slice(1)
  window.onload = function(){
    //if browser support local localStorage
    document.getElementById('IP').value = ip;
    document.getElementById('CIDR').value = cidr;
  }
}
// function Calculate()
//
function calculate(){
  // Look up the input elements in the document
  var ip = document.getElementById('IP');
  var CIDR_not = document.getElementById('CIDR');
  var subnet_address = document.getElementById('subnet');
  var network_address = document.getElementById('networkaddress');
  var broadAdress = document.getElementById('broadcast_address');
  var HostRange = document.getElementById('host_range');
  var hosts_total = document.getElementById('total_hosts');
  var hosts_usable = document.getElementById('usable_hosts');
  // CIDR to decimal

  // console.log('192.168.0.1')
  var ipaddress = ip.value.split('.');

  const mask = new Map([
    [1, 128],
    [2, 192],
    [3, 224],
    [4, 240],
    [5, 248],
    [6, 252],
    [7, 254],
    [8, 255]
  ])
  // Get the network address in decimal notation
  const subnetToNet = new Map([
    [128, 128],
    [192, 64],
    [224, 32],
    [240, 16],
    [248, 8],
    [252, 4],
    [254, 2],
    [255, 1]
  ])

  //
  // console.log(ipaddress)

  // CIDR to decimal chart

  // masks |      |     |     | subnet mask | networks | address
  // /1    | /9   | /17 | /25 | 128         | 2        |  128
  // /2    | /10  | /18 | /26 | 192         | 4        |  64
  // /3    | /11  | /19 | /27 | 224         | 8        |  32
  // /4    | /12  | /20 | /28 | 240         | 16       |  16
  // /5    | /13  | /21 | /29 | 248         | 32       |  8
  // /6    | /14  | /22 | /30 | 252         | 62       |  4
  // /7    | /15  | /23 | /31 | 254         | 128      |  2
  // /8    | /16  | /24 | /32 | 255         | 256      |  1
  // map only the first col with subnet mask
  // subnet mask : if <= 8 then divide by 8 and take the quotient (as col)
  // fill col with 255
  // if a remainder then check the map
  // network / subnet address - bring down otherwise

  // broadcast address : if mask is 255 bring down the ip address
  // if 0 then use 255
  //usable range = first: n + 1 (last bit), last: b - 1 (last bit)

  // Gets the subnet mask in decimal notation

  // console.log(mask.get(3))
  var subnetArr = [];

  var cidr = CIDR_not.value.slice(1)

  if(cidr > 8){
    var col = Math.floor(cidr / 8)
    var i;
    for( i = 0; i < col; i++){
      subnetArr.push(255)
    }
    // check for remainder: if consider mask map else push 0
    if(cidr % 8 != 0 && i < 4){
      subnetArr.push(mask.get(cidr % 8))
      i++;
    }
    if(i < 4){
      while(i < 4){
        subnetArr.push(0)
        i++;
      }
    }
  }
  else{
    subnetArr.push(mask.get(cidr%9))
    for(var i = 1; i < 4; i++){
      subnetArr.push(0)
    }
  }
  var SubnetMask = subnetArr.join('.')

  // network / subnet adress
  var networkArr = []
  for(var i = 0; i < 4; i++){
    if(subnetArr[i] == 255){
      networkArr.push(ipaddress[i])
    }
    else if(subnetArr[i] == 0){
      networkArr.push(0)
    }
    else{
      var getAdress = subnetToNet.get(subnetArr[i]) //eg 192->64
      var multiplier = Math.floor(ipaddress[i] / getAdress) // to get the range
      networkArr.push(getAdress * multiplier)
    }
  }

  var networkAdress = networkArr.join('.')

  // Broadcast address
  var broadcastArr = []
  for(var i = 0; i < 4; i++){
    if(subnetArr[i] == 255){
      broadcastArr.push(ipaddress[i])
    }
    else if(subnetArr[i] == 0){
      broadcastArr.push(255)
    }
    else{
      var getAdress = subnetToNet.get(subnetArr[i]) //eg 192->64
      if(ipaddress[i] == 0){
        broadcastArr.push(getAdress  - 1);
      }
      else{
        var multiplier = Math.ceil(ipaddress[i] / getAdress); // to get the range
        broadcastArr.push((getAdress * multiplier) - 1);
      }


    }
  }

  var broadcastAddress = broadcastArr.join('.')

  //Range of usable addresses of the subnet
  var firstUsable = networkArr.slice(0, 3).join('.') + '.' + (networkArr[3] + 1)
  var lastUsable = broadcastArr.slice(0, 3).join('.') + '.' + (broadcastArr[3] - 1)

  var UsableHostRange = firstUsable + '-' + lastUsable

  // Total no of hosts
  //calculating network bits

  var totalHosts = Math.pow(2, 32 - cidr)
  var totalUsableHosts = Math.pow(2, 32 - cidr) - 2

  // output
  // To save information in the browser
  // if (window.localStorage){
  //   localStorage.local_ip = ip;
  //   localStorage.local_cidr = cidr;
  // }
  // // To load input fields
  // window.onload = function(){
  //   //if browser support local localStorage
  //   document.getElementById('IP').value = ip;
  //   document.getElementById('CIDR').value = cidr;
  // }
  // Filling the output fields
  subnet_address.innerHTML = SubnetMask
  network_address.innerHTML = networkAdress
  broadAdress.innerHTML = broadcastAddress
  HostRange.innerHTML = UsableHostRange
  hosts_total.innerHTML = totalHosts
  hosts_usable.innerHTML = totalUsableHosts


}



// console.log(cidr)

// console.log(subnetArr)

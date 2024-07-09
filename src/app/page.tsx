import axios from 'axios';
// import { useState } from 'react';
const DOORLOOP_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiQVBJIiwiaWQiOiI2Njg4MWE4ODM0YWEzMTUyNzEyMzFlYWYiLCJleHAiOjIwMzU1NTU3MjB9.sLgT8w-7kb20wCQ-uE8QPRSYP-JOZNsqAwnecoeRTio"

const configEmp = {
  headers: {
    'Content-Type': 'application/json',
    "Authtoken": 'eyJraWQiOiJ6Yjhpb1wvSEJnaUFBOWJZb0p6U0NQcVZCTGp3ZkZVam8zM1BGK2NlZGxIdz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhOGIzMzEzNC0zYzIzLTQ0NTEtOWY0ZC0yNTE1OTJiZWNlMWYiLCJ3ZWJzaXRlIjoiZW1wb3JpYWVuZXJneS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfZ2hsT1hWTGkxIiwiY29nbml0bzp1c2VybmFtZSI6ImE4YjMzMTM0LTNjMjMtNDQ1MS05ZjRkLTI1MTU5MmJlY2UxZiIsImF1ZCI6IjRxdGU0N2pic3RvZDhhcG5maWMwYnVubXJxIiwiZXZlbnRfaWQiOiJjMmQxY2E4Mi1mZjgxLTRkYjMtYjA5Mi1mYWUwZDFmM2ZlZjciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcyMDU1NDM2NSwibmFtZSI6IlNhaGlsTWV0YWx3YWxhIiwiZXhwIjoxNzIwNTU3OTY1LCJpYXQiOjE3MjA1NTQzNjUsImVtYWlsIjoic2FoaWxtZXRhbHdhbGFAZ21haWwuY29tIn0.gPwW4WufI2UneFEL-aODvrsVMhx48eOeuuVkSCPF2vFO5RiaYB7mD2fcjH-Q6rgQhyQK4vYXZ1JOKkdu0xO58PkQSB14n6hsOI-a4uymhxPC-ovXdputlskxRmDQkABPAx0ECD46RNzMlsKxhTeYkJnIjRs_wnAixDdbN06RbWQZ9WSLk_KqF7zaBvwc_-2abG52oKpaO-a-mRDKEsH9hq30HCHGDMqa4MoSf56kqPsq9-87ydN2nkBX7di5cNZwGHrs0Fv4wqqNedUZrS14Aad9AqENRaC14THv6ZL9FWE91ezO-ylMTHGXyyDfVgb5tUtSpMJ1wQ-A7A1OqwawBQ'
  }
}

const configDL = { headers: {"Authorization": "Bearer " + DOORLOOP_TOKEN}}

export default function Page() {
  // const [leaseId, setLeaseId] = useState('');
  // const [propertyId, setPropertyId] = useState('');

  // const getEmporia = async() => {
  //   "use server";
  //   const result = await axios.get("https://api.emporiaenergy.com/customers/devices", configEmp)
  //   console.log(result.data.devices)
  // };


  const postCharges = async(leaseId: string, propertyId: string) => {
    'use server';
    // get sensor using property/unit
    const sensorId = 348148;
    const deviceInfo = await axios.get(`https://api.emporiaenergy.com/AppAPI?apiMethod=getChartUsage&deviceGid=${sensorId}&channel=1,2,3&start=2024-07-01T20:00:00.000Z&end=2024-07-09T19:00:00.000Z&scale=1MON&energyUnit=KilowattHours`, configEmp)
    let charge = (deviceInfo.data['usageList'][0] * .132).toFixed(2);
    console.log(deviceInfo.data, propertyId, charge)
    const chargeData = {
      "date": "2024-07-09", //new Date
      "lease": leaseId,     //"668ca883b7ad1f5a810768ad",
      "lines": [{
        "amount": charge,
        "account": "668557c73a92fd3a0881418f"
      }]
    }    
    await axios.post("https://app.doorloop.com/api/lease-charges", chargeData, configDL)
    console.info('POSTED !!!!!!')
  }

  const getLeases = async() => {
    'use server';
    const activeLeases = [];
    const allLeases = await axios.get("https://app.doorloop.com/api/leases", configDL)
     for (let x = 0; x < allLeases.data.total; x++) {
      if (allLeases.data.data[x]['status'] === 'ACTIVE') {
        activeLeases.push({ lease: allLeases.data.data[x]['id'], property: allLeases.data.data[x]['property']})
        console.log(activeLeases)
        let leaseId = activeLeases[0]['lease']
        let propertyId = activeLeases[x]['property']
        // let setLeaseId = activeLeases[0]['lease']
        // let setPropertyId = activeLeases[x]['property']
        postCharges(leaseId, propertyId)
        // return [leaseId, propertyId]
      }
    }
  }

  return (
    <div>
        <>
          <div></div>
          {/* <form action={getEmporia}>
            <button type="submit">Get emp</button>
          </form> */}
          <form action={getLeases}>
            <button type="submit">Charge Lease</button>
          </form>
          {/* <form action={postCharges}>
            <button type="submit">Post Charges</button>
          </form> */}
        </>
    </div>
  );
}
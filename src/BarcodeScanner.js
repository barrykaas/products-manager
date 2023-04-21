import { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { useCookies } from 'react-cookie';


import Box from '@mui/material/Box';

import { FormControl, InputLabel, Select, MenuItem, Avatar, Stack } from '@mui/material';

function BarcodeScanner({ setBarcode }) {
  const [camCookie, setCamCookie, removeCamCookie] = useCookies(['camera']);

  const [result, setResult] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState({deviceId: ""});
  const [displayScanner, setDisplay] = useState(false);


  const handleChange = (event) => {
    setDisplay(false);
    const selectedDeviceId = event.target.value;
    setSelectedDevice({deviceId: selectedDeviceId});
    console.log("selectedDeviceId", selectedDeviceId);
    setCamCookie('camera', selectedDeviceId, { path: '/' });

    setDisplay(true);
  };

  useEffect(() => {
    async function getMediaDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log("Media Devices:", devices);
        setDevices(devices.filter((device) => device.kind === "videoinput"));
      } catch (err) {
        console.error("Failed to get media devices:", err);
      }

      setSelectedDevice({deviceId: camCookie.camera});
      console.log(selectedDevice.deviceId);
      if (selectedDevice) {
        setDisplay(true);
      }
    }

    getMediaDevices();
    
  }, []);

  return (
      <Stack sx={{ width: '100%' }} spacing={1}>
          {/* <video ref={ref} style={{ width: '100%', height: 'auto' }}></video> */}
          {displayScanner ? (
            //<Box sx={{ borderRadius: 3, borderColor: 'primary.main', border: '1px dashed grey', overflow: 'hidden' }}>
            <Avatar variant="rounded" sx={{ width: 1, height: 1 }}>
              <BarcodeScannerView setBarcode={setBarcode} deviceId={selectedDevice.deviceId}></BarcodeScannerView>
            </Avatar>
            //</Box>
          ) : (
          <p>none</p>
          )}

      <FormControl fullWidth>
        <InputLabel id="device-select-label">Device</InputLabel>
        <Select labelId="device-select-label" id="device-select" value={selectedDevice.deviceId} label="Device" onChange={handleChange}>
          {devices.map((device) => (
            <MenuItem key={device.deviceId} value={device.deviceId}>
              {device.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
    </Stack>
  );
}

function BarcodeScannerView({ setBarcode, deviceId }) {
  const [result, setResult] = useState("");

  const { ref } = useZxing({
    onResult(result) {
      setResult(result.getText());
      setBarcode(result.getText());
    },
    deviceId: deviceId,
  });

  return (
    <video ref={ref} style={{ width: '100%', height: 'auto' }}></video>
  )
}


export default BarcodeScanner;
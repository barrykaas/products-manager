import React, { useEffect, useRef, useState } from 'react';
import { Box, Link, Button } from '@mui/material';
import {Html5QrcodeScanner} from "html5-qrcode"

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//   },
// }));

function QRCodeView({ setBarcode }) {
  

  const qrCodeRef = useRef(null);


  const onScanSuccess = (decodedText, decodedResult) => {
    alert(`Code matched = ${decodedText}`);
    setBarcode(decodedText);
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }
  
  const onScanFailure = (error) => {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }

  useEffect(() => {
    if (qrCodeRef) {
        let qrCodeRef = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: {width: 250, height: 250} },
            /* verbose= */ false);
            qrCodeRef.render(onScanSuccess, onScanFailure);
    }
  }, [qrCodeRef]);

  return (
    <Box sx={{ mt: 2 }}>
      <div id="reader" width="400px"></div>
    </Box>
  );
}

export default QRCodeView;
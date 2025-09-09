import React, { useEffect, useState, forwardRef } from 'react';
import Iconify from 'src/components/iconify';
import Quagga from 'quagga'; // For barcode scanning
import QrScanner from 'react-qr-scanner'; // For QR code scanning
import { Button, AppBar, Dialog, IconButton, Slide, Toolbar } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

// BarcodeQRScanner.defaultProps = {
//   onScan: (data) => console.log('Scanned:', data),
// };

const BarcodeQRScanner = ({ onScan, isScanStart, setIsScanStart }) => {
  const [error, setError] = useState(null);
  const [isQrScannerActive, setQrScannerActive] = useState(false);
  const [scanned, setScanned] = useState(false); // Prevent repeated scans
  const { enqueueSnackbar } = useSnackbar();
  const [borderColor, setBorderColor] = useState('white'); // Box border color

  const handleClose = () => {
    setIsScanStart(false);
    Quagga.stop(); // Stop Quagga when the dialog closes
  };

  const initializeQuagga = () => {
    if (!isQrScannerActive) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            target: document.querySelector('#barcode-scanner'), // Video element ID
          },
          decoder: {
            readers: ['code_128_reader', 'ean_reader', 'upc_reader'], // Add more barcode formats if needed
          },
        },
        (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err);
            setError('Unable to start barcode scanner');
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((data) => {
        if (!scanned) {
          setScanned(true);
          setBorderColor('green'); // Change border color on successful scan
          enqueueSnackbar(data.codeResult.code, { variant: 'success' });
          onScan(data.codeResult.code); // Pass scanned data to parent
          Quagga.stop(); // Stop scanning after detection
        }
      });

      return () => {
        Quagga.stop();
      };
    }
  };

  const handleQRScan = (data) => {
    if (data && data.text) {
      // Ensure data and data.text are defined
      if (!scanned) {
        setScanned(true);
        setBorderColor('green'); // Change border color on successful scan
        enqueueSnackbar(data.text, { variant: 'success' });
        onScan(data.text); // Pass scanned data to parent
      }
    } else {
      console.warn('Invalid QR scan data:', data); // Log invalid scan data
    }
  };

  const handleQRError = (err) => {
    console.error('QR Code Scan Error:', err);
    setError('Error scanning QR code');
  };

  const toggleScanner = () => {
    setQrScannerActive((prev) => {
      const newState = !prev;
      if (!newState) {
        initializeQuagga(); // Reinitialize Quagga when switching back to barcode scanner
      }
      setScanned(false); // Reset scan status when switching scanners
      setBorderColor('white'); // Reset border color
      return newState;
    });
  };

  const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

  useEffect(() => {
    if (isScanStart && !isQrScannerActive) {
      setTimeout(() => {
        initializeQuagga();
      }, 1000);
    }
  }, [isScanStart, isQrScannerActive]);

  return (
    <>
      <Dialog open={isScanStart} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar position="relative">
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleClose}>
              <Iconify icon="eva:close-fill" />
            </IconButton>

            <Button color="inherit" onClick={toggleScanner}>
              {isQrScannerActive ? 'Switch to Barcode Scanner' : 'Switch to QR Scanner'}
            </Button>
          </Toolbar>
        </AppBar>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Video Feed and Overlay */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Barcode Scanner */}
          {!isQrScannerActive && (
            <div id="barcode-scanner" style={{ width: '100%', height: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '120px',
                  height: '50px',
                  border: `1px dashed ${borderColor}`,
                }}
              />
            </div>
          )}

          {/* QR Code Scanner */}
          {isQrScannerActive && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <QrScanner
                delay={300}
                style={{ width: '100%', height: '100%' }}
                onError={handleQRError}
                onScan={handleQRScan}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100px',
                  height: '100px',
                  border: `2px solid ${borderColor}`,
                }}
              />
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

BarcodeQRScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
  isScanStart: PropTypes.bool.isRequired,
  setIsScanStart: PropTypes.func.isRequired,
};

export default BarcodeQRScanner;

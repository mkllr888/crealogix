import {
  IPluginRegistry,
  DialogModule
} from '@map/core';
import {
  MapBase
} from '@map/application';
import {
  BrowserModule,
} from '@map/secure-browser';
import {
  QRScannerModule,
  QRScanResponse
} from '@map/qr-scanner';

/**
 * The application class defines what MAP modules are being used by the webapp.
 */
class Application extends MapBase {

  protected configureRegistrar(registrar: IPluginRegistry): void {
    // Call 'use' to include and set up a module
    DialogModule.use(registrar);
    BrowserModule.use(registrar);
    QRScannerModule.use(registrar);
  }
}

// Create an application instance
const application = new Application();

// When the close button is pressed, we access the services for
// showing dialogs or closing the secure browser.
export const onClose = function () {
  application.ready().then((provider) => {
    DialogModule.getService(provider).confirm('Please confirm', 'Do you want to close the page?').then((response) => {
      if (response.success) {
        BrowserModule.getService(provider).closePage();
      }
    });
  });
};

const onQROpen = function () {
  application.ready().then((provider) => {

    QRScannerModule.getService(provider).scanQRCode().then((response: QRScanResponse) => {
      // Do something with response.qrCode
    }).catch((code) => {
      // Handle errors (see codes below)
    });

  });
};

const onToast = function () {
  application.ready().then((provider) => {
    DialogModule.getService(provider).toast('I am a toast', 3).then((response) => {
      
    });
  });
};

// Register onClose() as the button event.
const addButtonEvents = function () {
  const closeButton = document.getElementById('mdb-close-action');
  const qrButton = document.getElementById('mdb-qr-button-action');
  const toastButton = document.getElementById('mdb-toast-action');

  if (closeButton) {
    application.ready().then((provider) => {
      closeButton.style.cursor = 'pointer';
      closeButton.addEventListener('click', onClose);
    }).catch(() => {
      closeButton.setAttribute('disabled', 'disabled');
    });
  }

  if (qrButton) {
    application.ready().then((provider) => {
      qrButton.style.cursor = 'pointer';
      qrButton.addEventListener('click', onQROpen);
    }).catch(() => {
      qrButton.setAttribute('disabled', 'disabled');
    });
  }

  if (toastButton) {
    application.ready().then((provider) => {
      toastButton.style.cursor = 'pointer';
      toastButton.addEventListener('click', onToast);
    }).catch(() => {
      toastButton.setAttribute('disabled', 'disabled');
    });
  }

};
document.addEventListener('DOMContentLoaded', addButtonEvents, false);

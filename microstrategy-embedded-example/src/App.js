import React from "react";
import "./App.css";
import MicrostrategyEmbedded from "./MicrostrategyEmbed";

function App() {
  const getMicrostrategySdkOptions = () => {
    return {
      // uiMessage
      uiMessage: { enabled: true, addToLibrary: false },
      tocFeature: { enabled: true }
      //containerHeight: '100%',
      //containerWidth: '100%',
      // more sdk options....
    };
  };
  const handleEmbeddedSuccess = mstrResponse => {
    // Embedded Dossier rendered successfully
  };

  const onError = err => {
    console.log("Embedded Error", err);
  };

  return (
    <div className="App">
      <h5 className="ml-4 mt-3">Embedded Dashboards</h5>

      <MicrostrategyEmbedded
        libraryBaseUrl="http://localhost:8080/MicroStrategyLibrary"
        projectID="AB314876415A6DCC0D09FCB0539A8DED"
        dossierID="28C2636047CE49BD97404E8B5AC05DC3"
        sdkOptionalParameters={getMicrostrategySdkOptions()}
        onSuccess={handleEmbeddedSuccess}
        onError={onError}
      />
    </div>
  );
}

export default App;

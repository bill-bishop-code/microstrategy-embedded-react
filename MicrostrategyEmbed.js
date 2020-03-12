import React, { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * 1. Include the library in your index.html:   <script src="https://host:port/MicroStrategyLibrary/javascript/embeddinglib.js"></script>
 * 2. Programmatically login to the library API to create a session/cookie
 * 3. Render this component from another react component: 
 *      <MicrostrategyEmbedded 
 *              libraryBaseUrl="https://...MicrostrategyLibrary" 
 *              projectID="AB314876415A6DCC0D09FCB0539A8DED" 
 *              dossierID="34377720440DBB46A5F8598F4E7106F6"
 *              sdkOptionalParameters={{                         
                    uiMessage: {enabled: true, addToLibrary: false },
                    tocFeature: {enabled: true}
                }}
 *              onError={handleEmbeddedError}
 *              onSuccess={handleEmbeddedSuccess}
 * 
 * 
 * />
 * 
 *
 * Microstrategy SDK reference: https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/EmbeddingSDK/Content/topics/Intro_to_the_Embedding_SDK.htm
 * 
 * @param {*} props
 * libraryBaseUrl   - the Microstrategy library base URL
 * projectID        - the Microstrategy project ID guid
 * dossierID        - the Microstrategy dossier ID guid
 * pageKey          - optional
 * 
 * onSuccess
 * 
 * 
 * additional functionality:
 * https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/EmbeddingSDK/Content/topics/AddFunct_SetProperties.htm
 * 
 * 
 */
const MicrostrategyEmbedded = props => {
  useEffect(
    () => {
      // React is done rendering this component, now ask Microstrategy to attach the dossier to the reactRef.current dom element
      createDossier();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.dossierID, props.projectID, props.pageKey, props.libraryBaseUrl]
  );

  // React 'escape hatch' for dealing with external DOM updates: https://reactjs.org/docs/refs-and-the-dom.html
  // 1. Create a ref
  // 2. set the "ref" attribute on the div element
  // 3. use the ref.current to get to the raw DOM element outside of reacts control
  const reactRef = React.createRef();

  const createDossierParameters = () => {
    // Mandatory params
    const sdkParameters = {
      placeholder: reactRef.current, //placeholderDiv,
      url: buildLibraryUrl()
    };

    // User parameters - copy all properties from user supplied object to this object
    for (var property in props.sdkOptionalParameters) {
      sdkParameters[property] = props.sdkOptionalParameters[property];
    }
    return sdkParameters;
  };

  /**
   * Creates the dossier using Microstrategy SDK and places it in the reactRef.current dom element
   */
  const createDossier = async () => {
    try {
      // dossier.create returns a promise
      const mstrResponse = await window.microstrategy.dossier.create(
        createDossierParameters()
      );
      if (typeof props.onSuccess !== "undefined") props.onSuccess(mstrResponse);
    } catch (err) {
      if (typeof props.onError !== "undefined") props.onError(err);
    }
  };

  /**
   * Builds the library url that will be used in the microstrategy.dossier.create method
   */
  const buildLibraryUrl = () => {
    let url = `${props.libraryBaseUrl}/app/${props.projectID}/${props.dossierID}`;
    if (typeof props.pageKey !== "undefined") {
      url = url + `/${props.pageKey}`;
    }
    return url;
  };

  return <div id={`embeddedDossier-${props.dossierID}`} ref={reactRef}></div>;
};

MicrostrategyEmbedded.propTypes = {
  libraryBaseUrl: PropTypes.string.isRequired,
  projectID: PropTypes.string.isRequired,
  sdkOptionalParameters: PropTypes.object, // follow the MSTR documentation for details
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default MicrostrategyEmbedded;

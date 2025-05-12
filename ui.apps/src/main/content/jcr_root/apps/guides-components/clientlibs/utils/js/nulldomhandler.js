function nullDomHanlder(domElement) {
  try {
    if(!domElement) {
      throw new Error(domElement, "is null or undefined. Please check the source of the element.");
    }

    return domElement;
  } catch (error) {
    console.warn(error);
    return  document.createElement("div");
  }
}

export default nullDomHanlder;

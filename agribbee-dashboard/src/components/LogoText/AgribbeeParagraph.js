import styled from "styled-components";

const AgribbeeParagraph = ({ text = "", color }) => {
  const targetWord = "AgriBbee";
  const targetIndex = text.indexOf(targetWord);

  if (targetIndex === -1) {
    // If "AgriBbee" is not found, return the original text
    return <span>{text}</span>;
  }

  // Split the text around "AgriBbee"
  const beforeTargetWord = text.substring(0, targetIndex); // Text before "AgriBbee"
  const afterTargetWord = text.substring(targetIndex + targetWord.length); // Text after "AgriBbee"

  // Split the targetWord itself into three parts: beforeB, B, and afterB

  const firstB = targetWord.substring(0, 8);

  const FirstB = styled.span`
    color: ${color};
    text-transform: capitalize;
  `;
  const AfterB = styled.span``;

  return (
    <>
      {beforeTargetWord}
      <FirstB>{firstB}</FirstB>
      {afterTargetWord} {/* Text after "AgriBbee" */}
    </>
  );
};

export default AgribbeeParagraph;

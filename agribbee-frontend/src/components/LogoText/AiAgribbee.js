import styled from "styled-components";

const AiAgribbee = ({ text = "", color }) => {
  const targetWord = "AI-AGRIBBEE";
  const targetIndex = text.indexOf(targetWord);

  if (targetIndex === -1) {
    // If "AgriBbee" is not found, return the original text
    return <span>{text}</span>;
  }

  // Split the text around "AgriBbee"
  const beforeTargetWord = text.substring(0, targetIndex); // Text before "AgriBbee"
  const afterTargetWord = text.substring(targetIndex + targetWord.length); // Text after "AgriBbee"

  // Split the targetWord itself into three parts: beforeB, B, and afterB
  const beforeB = targetWord.substring(0, 7); // "Agri"
  const firstB = targetWord.charAt(8); // "B"
  const afterB = targetWord.substring(8, 10); // "b"
  const lastE = targetWord.substring(10, 11); // "ee"

  const FirstB = styled.span`
    color: ${color};
    text-transform: uppercase;
  `;
  const AfterB = styled.span``;

  return (
    <>
      {beforeTargetWord} {/* Text before "AgriBbee" */}
      {beforeB}
      <FirstB>{firstB}</FirstB>
      <AfterB>{afterB}</AfterB>
      {lastE} {/* "ee" */}
      {afterTargetWord} {/* Text after "AgriBbee" */}
    </>
  );
};

export default AiAgribbee;

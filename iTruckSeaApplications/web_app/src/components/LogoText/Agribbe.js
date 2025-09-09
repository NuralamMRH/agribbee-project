import styled from "styled-components";

const Agribbe = ({
  text = "",
  color,
  afterBColor,
  beforeBColor,
  lastEColor,
}) => {
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
  const beforeB = targetWord.substring(0, 4); // "Agri"
  const firstB = targetWord.charAt(5); // "B"
  const afterB = targetWord.substring(5, 6); // "b"
  const lastE = targetWord.substring(6, 8); // "ee"

  const FirstB = styled.span`
    color: ${color};
    text-transform: uppercase;
  `;
  const AfterB = styled.span`
    color: ${afterBColor || "white"};
  `;
  const BeforeB = styled.span`
    color: ${beforeBColor || ""};
  `;
  const LastE = styled.span`
    color: ${lastEColor || ""};
  `;

  return (
    <>
      {beforeTargetWord} {/* Text before "AgriBbee" */}
      <BeforeB>{beforeB}</BeforeB>
      <FirstB>{firstB}</FirstB>
      <AfterB>{afterB}</AfterB>
      <LastE>{lastE}</LastE>
      {afterTargetWord} {/* Text after "AgriBbee" */}
    </>
  );
};

export default Agribbe;

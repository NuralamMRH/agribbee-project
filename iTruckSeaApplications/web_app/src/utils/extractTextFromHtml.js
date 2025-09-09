import PropTypes from 'prop-types';

extractTextFromHtml.propTypes = {
  htmlString: PropTypes.string,
};

export default function extractTextFromHtml(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
}

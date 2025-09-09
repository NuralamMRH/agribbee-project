import PropTypes from 'prop-types';
//
import Image from '../../image';

// ----------------------------------------------------------------------

AvatarPreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  uploadDocument: PropTypes.bool,
};

export default function AvatarPreview({ file, uploadDocument }) {
  if (!file) {
    return null;
  }

  const imgUrl = typeof file === 'string' ? file : file.preview;

  return (
    <Image
      alt="avatar"
      src={imgUrl}
      sx={{
        zIndex: 8,
        overflow: 'hidden',
        borderRadius: uploadDocument ? 10 : '50%',
        position: 'absolute',
        width: `calc(100% - 16px)`,
        height: `calc(100% - 16px)`,
      }}
    />
  );
}

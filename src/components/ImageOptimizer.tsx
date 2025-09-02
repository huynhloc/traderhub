import React, { useMemo } from 'react';
import { TFile } from 'interfaces';
import { Box, BoxProps, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { getFileName } from 'utils';

export const optimizer = async (file: File) => {
  return new Promise((resolve) => {
    const imageObj = new Image();
    const canvasData = document.createElement('canvas');

    imageObj.onload = function () {
      const ratio = imageObj.width / imageObj.height;
      const maxRatio = MAX_CROP_IMG_W / MAX_CROP_IMG_H;

      if (
        imageObj.width <= MAX_CROP_IMG_W &&
        imageObj.height <= MAX_CROP_IMG_H
      ) {
        canvasData.width = imageObj.width;
        canvasData.height = imageObj.height;
      } else if (ratio >= maxRatio) {
        // base on MAX_CROP_IMG_W
        canvasData.width = MAX_CROP_IMG_W;
        canvasData.height = canvasData.width / ratio;
      } else {
        // base on MAX_CROP_IMG_H
        canvasData.height = MAX_CROP_IMG_H;
        canvasData.width = canvasData.height * ratio;
      }
      const ctx = canvasData.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasData.width, canvasData.height);
      }
      ctx?.drawImage(imageObj, 0, 0, canvasData.width, canvasData.height);

      canvasData?.toBlob((blob) => {
        resolve({
          file: blob as Blob,
          name: getFileName(file.name),
        });
      }, 'image/jpeg');
    };
    imageObj.src = URL.createObjectURL(file);
  });
};

export const URL = window.URL || window.webkitURL;
const MAX_CROP_IMG_W = 840;
const MAX_CROP_IMG_H = 840;

type Props = {
  file: File;
  onResized?: (tFile: TFile) => void;
  onRemove?: () => void;
};

const ImageOptimizer: React.FC<Props & BoxProps> = ({
  file,
  onResized,
  onRemove,
  ...boxProps
}) => {
  const originUrl = useMemo(() => {
    const imageObj = new Image();
    const canvasData = document.createElement('canvas');

    imageObj.onload = function () {
      const ratio = imageObj.width / imageObj.height;
      const maxRatio = MAX_CROP_IMG_W / MAX_CROP_IMG_H;

      if (
        imageObj.width <= MAX_CROP_IMG_W &&
        imageObj.height <= MAX_CROP_IMG_H
      ) {
        canvasData.width = imageObj.width;
        canvasData.height = imageObj.height;
      } else if (ratio >= maxRatio) {
        // base on MAX_CROP_IMG_W
        canvasData.width = MAX_CROP_IMG_W;
        canvasData.height = canvasData.width / ratio;
      } else {
        // base on MAX_CROP_IMG_H
        canvasData.height = MAX_CROP_IMG_H;
        canvasData.width = canvasData.height * ratio;
      }
      const ctx = canvasData.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasData.width, canvasData.height);
      }
      ctx?.drawImage(imageObj, 0, 0, canvasData.width, canvasData.height);

      canvasData?.toBlob((blob) => {
        onResized &&
          onResized({
            file: blob as Blob,
            name: getFileName(file.name),
          });
      }, 'image/jpeg');
    };
    const result = URL.createObjectURL(file);
    imageObj.src = result;
    return result;
  }, [file]);
  return (
    <Box>
      <Box
        overflow="hidden"
        position="relative"
        width="100px"
        bgcolor="background.default"
        {...boxProps}
      >
        <img
          width="100px"
          height="100px"
          style={{ objectFit: 'cover' }}
          src={originUrl}
        />
        {!!onRemove && (
          <Box position="absolute" top={0} right={0} bgcolor="common.white">
            <IconButton size="small" aria-label="close" onClick={onRemove}>
              <CloseIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImageOptimizer;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor';
import { styled } from '@material-ui/core/styles';
import { isInternalLink } from 'utils';
import MyCustomUploadAdapterPlugin from './MyCustomUploadAdapterPlugin';

const Wrapper = styled('div')({
  '& .ck-editor__main': {
    minHeight: 200,
  },
  '& .ck-content': {
    minHeight: 200,
  },
});

const configuration = {
  extraPlugins: [MyCustomUploadAdapterPlugin],
  placeholder: 'Hãy nhập nội dung',
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'alignment',
      'code',
      'undo',
      'redo',
    ],
  },
  language: 'vi',
  image: {
    toolbar: [
      'imageStyle:full',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      '|',
      'resizeImage',
      '|',
      'imageTextAlternative',
    ],
    styles: ['full', 'alignLeft', 'alignCenter', 'alignRight'],
  },
  mediaEmbed: { previewsInData: true },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  link: {
    decorators: {
      addTargetToExternalLinks: {
        mode: 'automatic',
        callback: (url) => !isInternalLink(url),
        attributes: {
          target: '_blank',
          rel: 'nofollow external noopener noreferrer',
        },
      },
    },
  },
  licenseKey: '',
};

type Props = {
  onChange?: () => void;
  value?: string;
};

const Editor: React.FC<Props> = React.forwardRef(({ value, onChange }, _) => {
  return (
    <Wrapper>
      <CKEditor
        editor={CustomEditor}
        config={configuration}
        data={value}
        onReady={(editor) => editor.setData(value)}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </Wrapper>
  );
});

export default Editor;

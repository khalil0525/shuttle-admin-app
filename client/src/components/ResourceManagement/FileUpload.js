import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];

      if (selectedFile) {
        const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/gif',
        ];

        if (allowedTypes.includes(selectedFile.type)) {
          const preparedFile = {
            id: uuidv4(),
            file: selectedFile,
            status: 'pending',
            progress: 0,
          };
          onUpload(selectedFile);
          setFile(preparedFile);
        } else {
          alert('Only PDF or image files are allowed.');
        }
      }
    },
    [onUpload]
  );

  const handleDelete = () => {
    setFile(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
      'application/pdf': ['.pdf'],
    },
  });

  const dropzoneStyle = {
    border: '2px dotted #888',
    padding: '0.4rem',
    textAlign: 'center',
    cursor: 'pointer',
    color: 'blue',
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={dropzoneStyle}>
        <input {...getInputProps()} />

        <p>Drag & drop a file here, or click to select a file (PDF or image)</p>
      </div>
      {file && (
        <div>
          <p>{file.file.name}</p>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

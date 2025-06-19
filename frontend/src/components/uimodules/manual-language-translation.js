import React, { useRef, useState } from 'react';
import './manuallanguagetranslation.css';

const LANGUAGES = [
  { value: 'german', label: 'German' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' }
];

const ManualLanguageTranslation = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);  
  const [language, setLanguage] = useState('german');
  const [processedFiles, setProcessedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    if (files.length > 0 && pdfFiles.length === 0) {
      alert('Only PDF files are allowed.');
      setUploadedFiles([]);
      setSelectedFile(null);      
      setLanguage('german');
      return;
    }
    setUploadedFiles(pdfFiles);
    setSelectedFile(pdfFiles[0] || null);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Function to upload file to backend
  const uploadFileToBackend = async (file, language) => {
    const formData = new FormData();
    console.log('uploadFileToBackend called', file, language);
    formData.append('file', file);
    formData.append('language', language);
    try {
      const response = await fetch('/api/translation/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Upload success:', data);
      return data;
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleProcess = async () => {
    console.log('handleProcess called');
    if (selectedFile) {
      // Upload file to backend
      await uploadFileToBackend(selectedFile, language);

      const newFile = {
        requestnumber: Math.floor(100000 + Math.random() * 900000), // 6-digit random number
        name: selectedFile.name,
        size: selectedFile.size,
        status: 'Processed',
        language: language,
        uploadedby: 'admin', // Placeholder for uploaded by user
        downloadUrl: '#', // Placeholder for download link
      };
      setProcessedFiles(prev => [...prev, newFile]);

      setUploadedFiles([]);
      setSelectedFile(null);
      setLanguage('german');

      // Change status to Completed after 5 seconds
      setTimeout(() => {
        setProcessedFiles(prev =>
          prev.map(file =>
            file.name === newFile.name && file.status === 'Processed'
              ? { ...file, status: 'Completed' }
              : file
          )
        );
      }, 5000);
    }
  };

  const handleRemoveProcessed = (idx) => {
    if (window.confirm('Are you sure you want to remove this file?')) {
      setProcessedFiles(processedFiles.filter((_, i) => i !== idx));
    }
  };

   const handleDownload = (file) => {
    // Implement actual download logic here
    //alert(`Download for ${file.name} triggered!`);
    const link = document.createElement('a');
    link.href = process.env.PUBLIC_URL + '/samplefile/translated_with_metrics.docx';
    link.download = 'translated_with_metrics.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="language-translation-container">
      <h2 className="language-translation-title">
        <span role="img" aria-label="proof">📝</span> Manual Language Translation
      </h2>

      {/* 1. File uploader */}
      <div
        className={`language-translation-uploader${dragActive ? ' language-translation-uploader-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (inputRef.current) inputRef.current.value = '';
          inputRef.current.click();
        }}
        style={{ cursor: 'pointer' }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          multiple={false}
          style={{ display: 'none' }}
          accept="application/pdf"
          ref={inputRef}
        />
        <div className="language-translation-upload-text">
          Click or drag PDF file here to upload
        </div>
        {uploadedFiles.length > 0 && (
          <div className="language-translation-selected-files">
            <strong>Selected:</strong> {uploadedFiles.map(f => f.name).join(', ')}
            <button
              className="language-translation-cancel-btn"
              style={{
                marginLeft: 12,
                background: '#fff',
                color: '#d32f2f',
                border: '1px solid #d32f2f',
                borderRadius: 4,
                padding: '2px 10px',
                cursor: 'pointer'
              }}
              onClick={e => {
                e.stopPropagation();
                setUploadedFiles([]);
                setSelectedFile(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              X
            </button>
          </div>
        )}
      </div>

      {/* 2. Section to show the uploaded file details */}
      {selectedFile && (
        <div className="language-translation-file-details">
          <h4 className="language-translation-file-details-title">Uploaded File Details</h4>
          <div className="language-translation-file-details-info">
            <span><strong>Name:</strong> {selectedFile.name}</span>
            <span><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</span>
          </div>
          <br></br>
          <div className="language-translation-option-row">
            <strong>Translate to:</strong>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="language-translation-language-select"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          <button
            className="language-translation-process-btn"
            onClick={handleProcess}
          >
            <span role="img" aria-label="process">🚀</span> Process File
          </button>
        
        </div>
      )}

      
      {/* 4. Grid showing uploaded and processed files */}
      <div className="language-translation-table-section">
        <h4 className="language-translation-table-title">Uploaded & Processed Files</h4>
        <table className="language-translation-table">
          <thead>
            <tr>
              <th>Request #</th>
              <th>File Name</th>
              <th>Size (KB)</th>              
              <th>Language</th>
              <th>Uploaded By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processedFiles.length === 0 ? (
              <tr>
                <td colSpan="7" align="center" className="language-translation-table-empty">
                  No files processed yet.
                </td>
              </tr>
            ) : (
              processedFiles.map((file, idx) => (
                <tr key={idx}>
                 <td>{file.requestnumber}</td>                  
                  <td>{file.name}</td>
                  <td>{(file.size / 1024).toFixed(2)}</td>                  
                  <td>{file.language}</td>
                  <td>{file.uploadedby}</td>
                  <td>{file.status}</td>
                  <td>
                    <button
                      className="language-translation-remove-btn"
                      onClick={() => handleRemoveProcessed(idx)}
                    >
                      Remove
                    </button>
                    {file.status === 'Completed' && (
                      <button
                        className="doc-proof-download-btn"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleDownload(file)}
                      >
                        Download
                      </button>
                    )}                    
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManualLanguageTranslation;
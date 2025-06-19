import React, { useState, useRef } from 'react';
import './DocProofReview.css';

const DocProofReview = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);  
  const [processedFiles, setProcessedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Only allow HTML files
    const htmlFiles = files.filter(file =>
      file.type === 'text/html' ||
      (file.name && file.name.toLowerCase().endsWith('.html'))
    );
    if (files.length > 0 && htmlFiles.length === 0) {
      alert('Only HTML files are allowed.');
      setUploadedFiles([]);     
      return;
    }
    setUploadedFiles(htmlFiles);
    setSelectedFile(htmlFiles[0] || null);
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

  const handleProcess = () => {
    if (selectedFile) {
      const newFile = {
        requestnumber: processedFiles.length + 1, // Incremental request number
        uploadedBy: 'admin', // Placeholder for user info
        name: selectedFile.name,
        size: selectedFile.size,          
        status: 'Processed',
        downloadUrl: '#', // Placeholder for download link
      };
      setProcessedFiles(prev => [...prev, newFile]);
      setUploadedFiles([]);
      setSelectedFile(null);

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
    alert(`Download for ${file.name} triggered!`);
    // const link = document.createElement('a');
    // link.href = process.env.PUBLIC_URL + '/samplefile/translated_with_metrics.docx';
    // link.download = 'translated_with_metrics.docx';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="doc-proof-container">
      <h2 className="doc-proof-title">
        <span role="img" aria-label="proof">📝</span> Document Proof Review
      </h2>

      {/* 1. File uploader */}
    <div
        className={`doc-proof-uploader${dragActive ? ' doc-proof-uploader-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          // Always reset input value so selecting the same file twice works
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
            accept=".html,text/html"
            ref={inputRef}
        />
        <span className="doc-proof-upload-text">
            Click or drag HTML file here to upload
        </span>
        {uploadedFiles.length > 0 && (
          <div className="doc-proof-selected-files">
            <strong>Selected:</strong> {uploadedFiles.map(f => f.name).join(', ')}
            <button
              className="doc-proof-cancel-btn"
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
        <div className="doc-proof-file-details">
          <h4 className="doc-proof-file-details-title">Uploaded File Details</h4>
          <div className="doc-proof-file-details-info">
            <span><strong>Name:</strong> {selectedFile.name}</span>
            <span><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</span>
          </div>
           <button
            className="doc-proof-process-btn"
            onClick={handleProcess}
          >
            <span role="img" aria-label="process">🚀</span> Process File
          </button>
        </div>
      )}     

      {/* 3. Grid showing uploaded and processed files */}
      <div className="doc-proof-table-section">
        <h4 className="doc-proof-table-title">Uploaded & Processed Files</h4>
        <table className="doc-proof-table">
          <thead>
            <tr>  
              <th>Request #</th>              
              <th>File Name</th>
              <th>Size (KB)</th>  
              <th> Uploaded By</th>            
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processedFiles.length === 0 ? (
              <tr>
                <td colSpan="7" align="center" className="doc-proof-table-empty">
                  No files processed yet.
                </td>
              </tr>
            ) : (
              processedFiles.map((file, idx) => (
                <tr key={idx}>
                    <td>{file.requestnumber}</td>
                  <td>{file.name}</td>
                  <td>{(file.size / 1024).toFixed(2)}</td> 
                  <td>{file.uploadedBy}</td>                
                  <td>{file.status}</td>
                  <td>
                    <button
                      className="doc-proof-remove-btn"
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

export default DocProofReview;
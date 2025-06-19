import React from 'react';
import './dashboard-options.css';

function DashboardOptions({ onCardClick }) {
  return (
    <div>
      <div className="dashboard-page-container">
        <div className="dashboard-card-group">
          <div
            className="dashboard-card"
            onClick={() => onCardClick('preinstall')}
          >            
            <img className="dashboard-card-img" src="/img/Translation-1.jpg" alt="Card cap" />
            <div className="dashboard-card-body">
              <h5 className="dashboard-card-title">Pre-Install Manual Language Translation</h5>
              <p className="dashboard-card-text">
                To translate technical pre-install manuals from the source document to various other languages.
              </p>
            </div>
          </div>
          <div
            className="dashboard-card"
            onClick={() => onCardClick('psdb')}
          >
            <img className="dashboard-card-img" src="/img/PSDBChat.png" alt="Card cap" />
            <div className="dashboard-card-body">
              <h5 className="dashboard-card-title">PSDB Service Chat</h5>
              <p className="dashboard-card-text">
                Objective is to create a chat interface to query the existing database. The ultimate objective is to automate and iteratively improve the responses.
              </p>
            </div>
          </div>
          <div
            className="dashboard-card"
            onClick={() => onCardClick('docproof')}
          >
            <img className="dashboard-card-img" src="/img/DocumentProofReview.png" alt="Card cap" />
            <div className="dashboard-card-body">
              <h5 className="dashboard-card-title">Document Proof Review</h5>
              <p className="dashboard-card-text">
                Conduct proof review of the translated documentation and provide corrected documents along changes highlighted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOptions;
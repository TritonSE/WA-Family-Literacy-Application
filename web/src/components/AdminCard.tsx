import React from 'react';
import { Admin } from '../models/Admin';
import DeleteIcon from '../assets/images/Minus-sign.svg';

import './AdminCard.css';

type AdminCardProps = {
  admin: Admin,
  deleteMode: boolean,
};

export const AdminCard: React.FC<AdminCardProps> = ({ admin, deleteMode }) => {

  return (
    <div className="container">
      <div className="adminCard">
        <h2>Test</h2>
      </div>
    </div>
  );
};
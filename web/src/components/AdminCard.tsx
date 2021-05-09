import React from 'react';
import { Admin } from '../models/Admin';
import DeleteIcon from '../assets/images/Minus-sign.svg';
import LockIcon from '../assets/images/lock-solid.svg';

import './AdminCard.css';

type AdminCardProps = {
  admin: Admin,
  deleteMode: boolean,
  onDelete: (id: string) => void,
};

export const AdminCard: React.FC<AdminCardProps> = ({ admin, deleteMode, onDelete }) => {

  return (
    <div className="container">
      <div className="adminCard">
        <div className="infoRow">
          <p className="text body3">Account # { admin.id } {admin.is_primary_admin && '(Admin)'}</p>
          <p className="row body3">{ admin.name }</p>
        </div>
      </div>
      {admin.is_primary_admin && deleteMode && <img className="deleteIcon" role="presentation" src={LockIcon} width="20px" height="20px" alt=""/> }
      {!admin.is_primary_admin && deleteMode && <img className="deleteIcon" role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={() => onDelete(admin.id)}/>}
    </div>
  );
};
import React, { useState } from 'react';
import { Admin } from '../models/Admin';
import DeleteIcon from '../assets/images/Minus-sign.svg';
import LockIcon from '../assets/images/lock-solid.svg';

import './AdminCard.css';

type AdminCardProps = {
  admin: Admin,
  deleteMode: boolean,
  onDelete: (id: string) => void,
  // manageMode: boolean,
  // onManage: (id: string) => void,
};

export const AdminCard: React.FC<AdminCardProps> = ({ admin, deleteMode, onDelete }) => {


  const [manageMode, setManageMode] = useState(false);
  const [manageModal, setManageModal] = useState(false);
  const [manageId, setManageId] = useState('');
  const [manageAdmin, setManageAdmin] = useState(false);

  const displayModalManage = (id: string): void => {
    setManageModal(true);
    setManageId(id);
  };

  const handleManage = async (): Promise<void> => {
    setManageModal(false);
    // await client.updateAdmin(manageId);
    // setAdmins();
  };

  console.log(manageMode);

  return (
    <div className="container">
      <div className="adminCard" onClick={() => !deleteMode && displayModalManage(admin.id)} style={deleteMode ? {cursor: 'default'} : {cursor: 'pointer'}}>
        <div className="infoRow">
          <p className="text body3">Account # { admin.id } {admin.is_primary_admin && '(Primary Admin)'}</p>
          <p className="row body3">{ admin.name }</p>
        </div>
      </div>
      
      {admin.is_primary_admin && deleteMode && <img className="lockIcon" role="presentation" src={LockIcon} width="20px" height="20px" alt=""/> }
      
      {!admin.is_primary_admin && deleteMode && <img className="deleteIcon" role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={() => onDelete(admin.id)}/>}
      
      { manageModal &&
        (
          <div className="modal">
            <div className="modalContentManage">    
              <form>
                <div style={{backgroundColor: 'red'}}>
                  <p className="h2 modalTitleManage">Manage Account</p>
                  <p className="body3 modalTextManage">(Check the boxes to grant this account specific access)</p>
                  <div className="buttonsContainer">
                    <button className="cancelBtn body3" type="button" onClick={() => setManageModal(false)}>Cancel</button>
                    <button className="deleteBtn body3" type="button" onClick={handleManage}>Confirm</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div>
  );
};
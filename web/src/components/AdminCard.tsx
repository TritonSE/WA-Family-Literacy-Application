import React, { useState } from 'react';
import { Admin } from '../models/Admin';
import DeleteIcon from '../assets/images/Minus-sign.svg';
import LockIcon from '../assets/images/lock-solid.svg';

import '../App.css';
import styles from './AdminCard.module.css';

type AdminCardProps = {
  admin: Admin,
  deleteMode: boolean,
  onDelete: (id: string) => void,
  // manageMode: boolean,
  // onManage: (id: string) => void,
};

export const AdminCard: React.FC<AdminCardProps> = ({ admin, deleteMode, onDelete }) => {

  // states for managing an admin
  const [manageModal, setManageModal] = useState(false);
  const [manageId, setManageId] = useState('');
  const [managePrimaryAdmin, setManagePrimaryAdmin] = useState(false);


  const displayManageModal = (admin: Admin): void => {
    setManageId(admin.id);
    if (admin.is_primary_admin) {
      setManagePrimaryAdmin(true);
    } else {
      setManageModal(true);
    }
  };

  const handleManage = async (): Promise<void> => {
    setManageModal(false);
    // await client.updateAdmin(manageId);
    // setAdmins(); ?
  };

  const handlePrimaryManage = (): void => {
    setManagePrimaryAdmin(false);
    setManageModal(true);
  };

  return (
    <div className={styles.container}>

      <div className={styles.adminCard} onClick={() => !deleteMode && displayManageModal(admin)} style={deleteMode ? {cursor: 'default'} : {cursor: 'pointer'}}>
        <span className={styles.adminName}>{ admin.name }</span>
        { admin.is_primary_admin && <span className={styles.adminName}>(Primary Admin)</span> }
      </div>
      
      {admin.is_primary_admin && deleteMode && <img className={styles.lockIcon} role="presentation" src={LockIcon} width="20px" height="20px" alt=""/> }
      
      {!admin.is_primary_admin && deleteMode && <img className={styles.deleteIcon} role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={() => onDelete(admin.id)}/>}
      

      { managePrimaryAdmin &&
        (
          <div className={styles.modal}>
            <div className={styles.modalContentContinue}>    
              <div>
                <p className={styles.modalTextManage}>Are you sure you want to make changes to the Admin Account?</p>
                <div className={styles.buttonsContainer}>
                  <button className={styles.cancelButton} type="button" onClick={() => setManagePrimaryAdmin(false)}>Cancel</button>
                  <button className={styles.deleteButton} type="button" onClick={handlePrimaryManage}>Continue</button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      { manageModal &&
        (
          <div className={styles.modal}>
            <div className={styles.modalContentManage}>    
              <form>
                <div style={{backgroundColor: 'red'}}>
                  <p className={styles.modalTitleManage}>Manage Account</p>
                  <p className={styles.modalTextManage}>(Check the boxes to grant this account specific access)</p>
                  <div className={styles.buttonsContainer}>
                    <button className={styles.cancelButton} type="button" onClick={() => setManageModal(false)}>Cancel</button>
                    <button className={styles.deleteButton} type="button" onClick={handleManage}>Confirm</button>
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